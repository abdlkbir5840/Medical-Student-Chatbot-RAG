import streamlit as st
import base64
from io import BytesIO
from pathlib import Path
import requests

st.set_page_config(
    page_title="Ollama PDF RAG Streamlit UI",
    page_icon="🎈",
    layout="wide",
    initial_sidebar_state="collapsed",
)

def main() -> None:
    """
    Main function to run the Streamlit application.
    """
    st.subheader("🤖 Medical Chatbot For Anatomy & Physiology Students", divider="gray", anchor=False)

    # Layout configuration
    col1, col2 = st.columns([1.5, 2])

    # Initialize session state
    if "messages" not in st.session_state:
        st.session_state["messages"] = [
            {"role": "assistant", "content": "How can I assist you today?", "sources": []}
        ]
    if "vector_db" not in st.session_state:
        st.session_state["vector_db"] = None

    available_models = ("Model1", "Model2", "Model3") 
    selected_model = col2.selectbox(
        "Pick a model available locally on your system ↓", 
        available_models,
        key="model_select"
    )

    use_sample = col1.toggle(
        "Enable PDF-based conversation", 
        key="sample_checkbox"
    )

    if use_sample:
        file_upload = col1.file_uploader(
            "Upload a PDF file ↓", 
            type="pdf", 
            accept_multiple_files=False,
            key="pdf_uploader"
        )

        if file_upload:
            try:
                pdf_data = file_upload.read()
                pdf_base64 = base64.b64encode(pdf_data).decode("utf-8")
                pdf_link = f"data:application/pdf;base64,{pdf_base64}"
                col1.markdown(
                    f'<iframe src="{pdf_link}" width="100%" height="600px" style="border: none;"></iframe>',
                    unsafe_allow_html=True
                )
                try:
                    api_url = "http://127.0.0.1:8000/upload-pdf/"
                    files = {
                        "file": (file_upload.name, pdf_data, "application/pdf")
                    }
                    response = requests.post(api_url, files=files)
                    if response.status_code == 200:
                        col1.success(f"PDF uploaded successfully: {response.json()['message']}")
                        st.session_state["pdf_uploaded"] = True
                except Exception as e:
                    col1.error(f"Failed to upload PDF: {e}")
            except Exception as e:
                st.error(f"Failed to read PDF: {e}")
        else:
            # if st.session_state["vector_db"] is None:
            st.warning("Upload a PDF file to begin chat with the PDF content...")

    with col2:
        message_container = st.container(height=500, border=True)

        # Display chat history
        for i, message in enumerate(st.session_state["messages"]):
            avatar = "🤖" if message["role"] == "assistant" else "😎"
            with message_container.chat_message(message["role"], avatar=avatar):
                st.markdown(message["content"])
                # Display resources if present
                if message.get("sources"):
                    # Create columns dynamically
                    cols = st.columns(3)
                    
                    for i, source in enumerate(message["sources"]):
                        short_source = source if len(source) <= 20 else source[:17] + "..."
                        with cols[i % len(cols)]:  # Use modulo to wrap the buttons into columns
                            if st.button(short_source, key=f"source_{i}_{short_source}"):
                                st.info(f"Full Source: {source}")

        # Chat input and static response
        if prompt := st.chat_input("Enter a prompt here...", key="chat_input"):
            try:
                # Add user message to chat
                st.session_state["messages"].append({"role": "user", "content": prompt})
                with message_container.chat_message("user", avatar="😎"):
                    st.markdown(prompt)   

                if use_sample:
                    payload = {
                        "query": prompt,
                        "index":"user",
                    }
                    api_response = requests.post("http://127.0.0.1:8000/query", json=payload)
                    response_data = api_response.json()      
                    response = response_data.get("response", "No response from model.")
                    sources = response_data.get("sources", [])

                else:
                    payload = {
                        "query": prompt,
                        "index":"general",
                    }
                    api_response = requests.post("http://127.0.0.1:8000/query", json=payload)
                    response_data = api_response.json()      
                    response = response_data.get("response", "No response from model.")
                    sources = response_data.get("sources", [])
                
                with message_container.chat_message("assistant", avatar="🤖"):
                    st.markdown(response)
                    if sources:
                        # Create columns dynamically
                        cols = st.columns(3)
                        
                        for i, source in enumerate(sources):
                            short_source = source if len(source) <= 20 else source[:17] + "..."
                            with cols[i % len(cols)]:  # Use modulo to wrap the buttons into columns
                                if st.button(short_source, key=f"source_{i}_{short_source}"):
                                    st.info(f"Full Source: {source}")

                st.session_state["messages"].append(
                    {"role": "assistant", "content": response, "sources": sources}
                )

            except Exception as e:
                st.error(e, icon="⛔️")

if __name__ == "__main__":
    main()

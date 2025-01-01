

# FastAPI PDF Chunking App

This FastAPI application allows you to upload a PDF file, process it, and receive the text extracted from the PDF in chunks. It uses the `docling` library to convert PDF documents and split the extracted text into smaller chunks. The app also supports OCR (Optical Character Recognition) for scanned PDFs.

# How to Run

### Install Dependencies

1. Clone the repository or download the project files.
2. Create a virtual environment:

   ```bash

   python -m venv venv

   ```

```


3. Activate the virtual environment:

   * On macOS/Linux:

     ```bash

     source venv/bin/activate

     ```

   * On Windows:

     ```bash

     venv\Scripts\activate

     ```

4. Install the required dependencies:

   ```bash

   pip install -r requirements.txt

```

### Run the Application

Start the FastAPI server with Uvicorn:

```bash

uvicorn app.main:app --reload

```

The application will be running at `http://127.0.0.1:8000`.

## How to Use the API

### Endpoint: `/convert_pdf/`

* **Method** : `POST`
* **Description** : Upload a PDF file to this endpoint, and the server will return the extracted text split into chunks.

#### Request:

* **File** : Upload a PDF file in the request body.

#### Response:

The server will respond with a JSON object containing the text chunks. Each chunk will have a `chunk_id` and the corresponding `text`.

Example response:

```json

{

  "chunks": [

    {"chunk_id": 0, "text": "First chunk of text..."},

    {"chunk_id": 1, "text": "Second chunk of text..."}

  ]

}

```

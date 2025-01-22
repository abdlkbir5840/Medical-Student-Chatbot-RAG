"use client";

import { useState, useEffect, useRef } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Toolbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
} from "@mui/material";

import ChatMessages from "@/components/qa/ChatMessages";
import ChatInput from "@/components/qa/ChatInput";
import SettingsPanel from "@/components/setting/SettingsPanel";
import { uploadPdf, sendQuery, translateQuery } from "@/lib/api";
import { publicAxios } from "../api/config";
import { GTE_PDF, UPLOAD_PDF, GET_LLMS, EDIT_LLM_STATS, GTE_PDFS } from "../api/routes";

export default function QA() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "How can I assist you today?",
      sources: [],
      stackTrace: {},
    },
  ]);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedPdf, setSelectedPdf] = useState('');
  const [useSample, setUseSample] = useState(false);
  const [useGeneralData, setUseGeneralData] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [addToGeneralData, setAddToGeneralData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalStep, setModalStep] = useState("");
  const socketRef = useRef(null);
  const [userId, setUserId] = useState();
  const [availableModels, setAvailableModels] = useState([])
  const [availablePdfs, setAvailablePdfs] = useState([])
  const [indexName, setIndexName] = useState('')
  const [isThinking, SetIsThinking] = useState(false);

  
  const handleModelChange = (model) => {
    setSelectedModel(model);
  };
  const handlepdfChange = async (indexName) =>{
    setSelectedPdf(indexName);
    fetchPdfPreview(userId, indexName)
  }
  const handleUseSampleToggle = () => {
    setUseSample(!useSample);
    if (!useSample) {
      setUseGeneralData(false);
    }
  };

  const handleUseGeneralDataToggle = () => {
    setUseGeneralData(!useGeneralData);
  };

  const handleAddToGeneralDataToggle = () => {
    setAddToGeneralData(!addToGeneralData);
  };

  const handleFileUpload = async (file) => {
    if (file && file.type === "application/pdf") {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          return alert("User is not authenticated. Please log in.");
        }
        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("userId", userId);
        const response = await publicAxios.post(UPLOAD_PDF, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("PDF uploaded successfully!");

        const indexName = response.data.pdfRecord.indexName;
        localStorage.setItem("indexName", indexName);
        setIndexName(indexName);
        fetchPdfPreview(userId, indexName);

        // upload pdf to RAG server
        const storeType = addToGeneralData ? "user_and_general" : "user";
        setOpenModal(true);
        const result = await uploadPdf(file, storeType, indexName, userId);
        setModalStep("PDF uploaded and processed successfully!");
        alert(result.message)
        fetchUserPdfs(userId)
      } catch (error) {
        console.error("Error uploading PDF:", error);
        alert(
          "Failed to upload PDF: " +
            (error instanceof Error ? error.message : "Unknown error")
        );
        setPdfPreview(null);
      }
    } else {
      alert("Please upload a valid PDF file");
      setPdfPreview(null);
    }
  };

  const fetchPdfPreview = async (userId, indexName) => {
    try {
      const response = await publicAxios.get(GTE_PDF(userId, indexName), {
        responseType: "blob",
      });
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileUrl = URL.createObjectURL(file);
      setPdfPreview(fileUrl);
    } catch (error) {
      console.error("Error fetching PDF preview:", error);
    }
  };


  const handleUpdateLlmStats = async (llm_name, userId, inputTokensIncrement, outputTokensIncrement) => {
    try {
      const data = {llm_name, userId, inputTokensIncrement, outputTokensIncrement}
      const response = await publicAxios.put(EDIT_LLM_STATS, data);
      console.log(response);
    } catch (error) {
      console.error("Error updating llm stats:", error);
    }
  };

  const handleSendPrompt = async (prompt) => {
    SetIsThinking(true)
    const newMessages = [...messages, { role: "user", content: prompt }];
    setMessages(newMessages);
    localStorage.setItem("chatMessages", JSON.stringify(newMessages));

    try {
      let search_type = "general_collection";
      if (useSample) {
        search_type = useGeneralData ? "user_and_general" : "user_collection";
      }
      const data = await sendQuery(prompt, indexName, selectedModel, search_type);
      const assistantMessage = {
        role: "assistant",
        content: data.response,
        sources: data.sources,
        stackTrace: data.stackTrace,
      };
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
      SetIsThinking(false);
      await handleUpdateLlmStats(selectedModel, userId, data.stackTrace.inputTokens, data.stackTrace.outputTokens)
    } catch (error) {
      alert("Error: " + error.message);
    }
  };
  const processText = (text) => {
    const languageKeywords = [
      "French", "English", "Spanish", 
      "Français", "Anglais", "Espagnol", 
      "Francés", "Inglés", "Español"
    ]; 
    const firstWords = text.split(' ').slice(0, 10).join(' ').toLowerCase();
  
    const shouldRemoveIntro = languageKeywords.some(keyword => firstWords.includes(keyword));
  
    if (shouldRemoveIntro) {
      return text.split(": ").slice(1).join(": ").trim();
    }
      return text;
  }
  const handleTranslate = async(language, messageIndex, currentMessage) => {
    try{
    SetIsThinking(true)
    const textProcessed = processText(currentMessage);
    const query = `Translate to ${language} this message: ${textProcessed}`
    console.log(query);
    const data = await translateQuery(query);
    console.log(data);
    console.log(data.translateQuery);
    const conversation = JSON.parse(localStorage.getItem('chatMessages')) || [];
    const translatedMessage = data.translatedQuery
    console.log(translateQuery);
    if (conversation[messageIndex] && translatedMessage) {
      conversation[messageIndex].content = translatedMessage;
      localStorage.setItem('chatMessages', JSON.stringify(conversation))
    }
    const savedMessages = localStorage.getItem("chatMessages");
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    SetIsThinking(false)
    } catch (error) {
      console.error("Error translating message:", error);
      alert("Error translating message: " + error.message);
      SetIsThinking(false)
    }
  } 
  const fetchLLMs = async () => {
    try {
      const response = await publicAxios.get(GET_LLMS);
      setAvailableModels(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchUserPdfs = async (userId) => {
    publicAxios
      .get(GTE_PDFS(userId))
      .then((response) => {
        setAvailablePdfs(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (pdfPreview) {
      console.log("Updated PDF Preview:", pdfPreview);
    }
  }, [pdfPreview]);

  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMessages = localStorage.getItem("chatMessages");
      // console.log(savedMessages);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const indexName = localStorage.getItem("indexName");
    setIndexName(indexName);

    setUserId(userId);
    const initialize = async () => {
      await fetchLLMs();
      await fetchUserPdfs(userId);
      if (availableModels.length > 0) {
        console.log(availableModels);
        setSelectedModel(availableModels[0]?.name);
      }
      if (availablePdfs.length > 0) {
        console.log(availablePdfs);
        setSelectedPdf(availablePdfs[0]?.name);
      }
    };

    initialize();
  }, []);
  
  useEffect(() => {
    const fetchPdfPreviewOnLoad = async () => {
      const storedUserId = localStorage.getItem("userId")
      const storedIndexName = localStorage.getItem("indexName")

      if (storedUserId && storedIndexName) {
        try {
          await fetchPdfPreview(storedUserId, storedIndexName)
          console.log(pdfPreview);
        } catch (error) {
          console.error("Error fetching PDF preview on load:", error)
        }
      } else {
        console.warn("Missing userId or indexName for PDF preview")
      }
    }

    fetchPdfPreviewOnLoad()
  }, [])

  useEffect(() => {
    if (availableModels.length > 0) {
      setSelectedModel(availableModels[0]?.name);
    }
  }, [availableModels]);

  useEffect(() => {
    const processId = userId;
    const ws = new WebSocket(`ws://localhost:8000/ws/${processId}`);
    socketRef.current = ws;
    console.log(socketRef.current);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      setModalStep(event.data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [userId]);


  return (
    <>
      {/* <Toolbar /> */}
      <Container
        maxWidth="xlg"
        sx={{ height: "90vh", display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{ my: 1, flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <Grid container spacing={1} sx={{ mt: 0, flexGrow: 1 }}>
            <Grid
              item
              xs={12}
              md={7}
              sx={{
                height: "calc(100vh - 80px)",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
                <SettingsPanel
                  selectedModel={selectedModel}
                  selectedPdf={selectedPdf}
                  useSample={useSample}
                  useGeneralData={useGeneralData}
                  addToGeneralData={addToGeneralData}
                  onModelChange={handleModelChange}
                  onPdfChange={handlepdfChange}
                  onUseSampleToggle={handleUseSampleToggle}
                  onUseGeneralDataToggle={handleUseGeneralDataToggle}
                  onAddToGeneralDataToggle={handleAddToGeneralDataToggle}
                  onFileUpload={handleFileUpload}
                  pdfPreview={pdfPreview}
                  availableModels = {availableModels}
                  availablePdfs={availablePdfs}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={5} sx={{ height: "calc(100vh - 80px)" }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    mb: 1,
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  <ChatMessages messages={messages} isThinking={isThinking} onTranslate={handleTranslate} />
                </Box>
                <ChatInput onSendPrompt={handleSendPrompt} />
              </Paper>
            </Grid>
            {/* Modal to show the PDF processing steps */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
              <DialogTitle>Processing PDF...</DialogTitle>
              <DialogContent>
                <Typography variant="body1">{modalStep}</Typography>
                {modalStep === "PDF uploaded and processed successfully!" ? (
                  <Button
                    onClick={() => setOpenModal(false)}
                    color="primary"
                    fullWidth
                  >
                    Close
                  </Button>
                ) : (
                  <CircularProgress
                    size={24}
                    sx={{ display: "block", margin: "auto" }}
                  />
                )}
              </DialogContent>
            </Dialog>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

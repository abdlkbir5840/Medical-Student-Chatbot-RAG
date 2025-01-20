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

import ChatMessages from "@/components/text-to-speech/ChatMessages";
import ChatInput from "@/components/text-to-speech/ChatInput";
import SettingsPanel from "@/components/setting/SettingsPanel";
import { uploadPdf, sendQuery } from "@/lib/api";
import { publicAxios } from "../api/config";
import {
  GTE_PDF,
  UPLOAD_PDF,
  GET_LLMS,
  EDIT_LLM_STATS,
  GENERATE_SPEECH,
  GTE_PDFS,
} from "../api/routes";
import { firstMessage } from "./first-message";

// const audios = [

//   {
//     role: "assistant",
//     content: {
//       type: "audio",
//       duration: "0:32",
//       url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
//     },
//     sources: ["audio-processing", "speech-recognition"],
//     stackTrace: {
//       userQuery: "Audio question",
//       chatbotResponse: "Audio answer...",
//     },
//   },
//   {
//     role: "user",
//     content: {
//       type: "audio",
//       duration: "0:15",
//       url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
//     },
//   },
//   // Add similar entries for other messages
// ];

export default function TextToSpeech() {
  const [messages, setMessages] = useState([firstMessage]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPdf, setSelectedPdf] = useState('');
  const [useSample, setUseSample] = useState(false);
  const [useGeneralData, setUseGeneralData] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [addToGeneralData, setAddToGeneralData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalStep, setModalStep] = useState("");
  const socketRef = useRef(null);
  const [userId, setUserId] = useState();
  const [availableModels, setAvailableModels] = useState([]);
  const [availablePdfs, setAvailablePdfs] = useState([])
  const [indexName, setIndexName] = useState("");
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

  const handleUpdateLlmStats = async (
    llm_name,
    userId,
    inputTokensIncrement,
    outputTokensIncrement
  ) => {
    try {
      const data = {
        llm_name,
        userId,
        inputTokensIncrement,
        outputTokensIncrement,
      };
      const response = await publicAxios.put(EDIT_LLM_STATS, data);
      console.log(response);
    } catch (error) {
      console.error("Error updating llm stats:", error);
    }
  };

  const getBlobDuration = (blob) => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const objectURL = URL.createObjectURL(blob);

      audio.src = objectURL;
      audio.preload = "metadata"; // Ensures metadata is loaded

      audio.onloadedmetadata = () => {
        if (audio.duration === Infinity || isNaN(audio.duration)) {
          audio.currentTime = 10000000; // Seek far to trigger duration loading
          audio.ontimeupdate = () => {
            resolve(audio.duration);
            URL.revokeObjectURL(objectURL); // Clean up
            audio.ontimeupdate = null;
          };
        } else {
          resolve(audio.duration);
          URL.revokeObjectURL(objectURL); // Clean up
        }
      };

      audio.onerror = () => {
        resolve(10); // Return 10 if failed to get duration
        URL.revokeObjectURL(objectURL); // Clean up
      };
    });
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // Base64 result is in reader.result
      reader.onerror = reject;
      reader.readAsDataURL(blob); // This triggers the conversion
    });
  };

  const handleSendPrompt = async (blob, inputText) => {
    // const text = inputText
    // "Sure! What would you like me to write about? Do you have a specific topic or type of content in mind, like a story, an article, or some code? Let me know!";

    try {
      SetIsThinking(true);
      const base64Audio = await blobToBase64(blob);
      const duration = await getBlobDuration(blob);
      const userMessage = {
        role: "user",
        content: {
          type: "audio",
          duration: duration,
          audioData: base64Audio,
        },
      };
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, userMessage];
        localStorage.setItem("chataudios", JSON.stringify(newMessages));

        return newMessages;
      });
      
      let search_type = "general_collection";
      if (useSample) {
        search_type = useGeneralData ? "user_and_general" : "user_collection";
      }
      const data = await sendQuery(
        inputText,
        indexName,
        selectedModel,
        search_type
      );
      console.log(data);
      const text = data.response;
      const response = await publicAxios.post(
        GENERATE_SPEECH,
        { text },
        { responseType: "arraybuffer" }
      );
      const audioBlob = new Blob([response.data], { type: "audio/mp3" });
      const chatbotBase64Audio = await blobToBase64(audioBlob);
      const chatbotAudioDuration = await getBlobDuration(audioBlob);
      const assistantMessage = {
        role: "assistant",
        content: {
          type: "audio",
          duration: chatbotAudioDuration,
          audioData: chatbotBase64Audio,
        },
        sources: data.sources,
        stackTrace: data.stackTrace,
      };
      setMessages((prevMessages) => {
        const newChatMessages = [...prevMessages, assistantMessage];
        localStorage.setItem("chataudios", JSON.stringify(newChatMessages));

        return newChatMessages; 
      });
      SetIsThinking(false);

      await handleUpdateLlmStats(
        selectedModel,
        userId,
        data.stackTrace.inputTokens,
        data.stackTrace.outputTokens
      );
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

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
    if (typeof window !== "undefined") {
      const savedMessages = localStorage.getItem("chataudios");
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const indexName = localStorage.getItem("indexName");
    setUserId(userId);
    setIndexName(indexName);
    const initialize = async () => {
      await fetchLLMs();
      await fetchUserPdfs(userId)
      if (availableModels.length > 0) {
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
                  availableModels={availableModels}
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
                  <ChatMessages
                    messages={messages}
                    isThinking={isThinking}
                  />
                </Box>
                <ChatInput onSendPrompt={handleSendPrompt} />
              </Paper>
            </Grid>
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

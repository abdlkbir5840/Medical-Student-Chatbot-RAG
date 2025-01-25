import React, { useState, useRef, useEffect } from "react";

import {
  Box,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import { Person, SmartToy, PlayArrow, Pause, Download } from "@mui/icons-material";
import StackTraceModal from "@/components/modal/StackTraceModal";
import ThinkingComponent from "../loader/ThinkingComponent";
const messages = [
  {
    role: "user",
    content: {
      type: "audio",
      duration: "0:15",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
  },
  {
    role: "assistant",
    content: {
      type: "audio",
      duration: "0:32",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    sources: ["audio-processing", "speech-recognition"],
    stackTrace: {
      userQuery: "Audio question",
      chatbotResponse: "Audio answer...",
    },
  },
  // Add similar entries for other messages
];

const AudioMessage = ({ duration, audioData, isUser }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // Tracks playback progress
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime;
    const totalTime = audioRef.current.duration;
    const percentage = (currentTime / totalTime) * 100;
    setProgress(percentage || 0); // Update progress
  };

  const handleSeek = (event) => {
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = event.clientX - rect.left; // Position of click relative to progress bar
    const clickPercentage = (clickPosition / rect.width) * 100;
    const newTime = (clickPercentage / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime; // Seek to new time
    setProgress(clickPercentage); // Update progress
  };

  return (
    <Box
      sx={{ width: "250px" }}
      className={`flex items-center space-x-2 p-2 rounded-full ${isUser ? "bg-blue-500" : "bg-green-500"}`}
    >
      <IconButton size="small" className="text-white" onClick={togglePlay}>
        {isPlaying ? (
          <Pause fontSize="small" />
        ) : (
          <PlayArrow fontSize="small" />
        )}
      </IconButton>
      <Box
        className="flex-grow h-1 bg-white bg-opacity-30 rounded-full relative cursor-pointer"
        onClick={handleSeek} // Listen for clicks on the progress bar
      >
        {/* Progress Bar */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            backgroundColor: "white",
            width: `${progress}%`, // Update width dynamically
            transition: "width 0.1s linear",
          }}
          className="rounded-full"
        />
      </Box>
      <Typography variant="caption" className="text-white min-w-[40px]">
        {duration}
      </Typography>
      <a href={audioData} download className="text-white">
        <IconButton size="small" className="text-white">
          <Download fontSize="small" />
        </IconButton>
      </a>
      <audio
        ref={audioRef}
        src={audioData}
        onTimeUpdate={handleTimeUpdate} // Track playback progress
        onEnded={() => {
          setIsPlaying(false);
          setProgress(0); // Reset progress when playback ends
        }}
      />
    </Box>
  );
};

export default function ChatMessagesPreview({ messages, isThinking }) {
  const messagesEndRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStackTrace, setSelectedStackTrace] = useState(null);

  const handleOpenModal = (stackTrace) => {
    setSelectedStackTrace(stackTrace);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStackTrace(null);
  };

  const scrollToBottom = () => {
    // console.log(messages);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        mb: 2,
        height: "calc(100% - 10px)",
      }}
    >
      {messages.map((message, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            justifyContent: message.role === "user" ? "flex-end" : "flex-start",
            mb: 2,
          }}
        >
          {message.role == "assistant" && (
            <Avatar
              sx={{
                ml: message.role === "user" ? 1 : 0,
                mr: message.role === "assistant" ? 1 : 0,
                bgcolor:
                  message.role === "user" ? "primary.dark" : "secondary.dark",
                width: 30,
                height: 30,
              }}
            >
              {message.role === "user" ? "👤" : "🤖"}
            </Avatar>
          )}
          <Box
            sx={{
              maxWidth: "80%",
              // backgroundColor: message.role === 'user' ? 'primary.main' : 'secondary.main',
              color: "white",
              borderRadius: 2,
              p: 1,
            }}
          >
            {/* <Typography variant="body1">{message.content}</Typography> */}
            <AudioMessage
              duration={message.content?.duration}
              isUser={message.role === "user"}
              audioData={message.content?.audioData}
            />

            {/* {message.sources && message.sources.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {message.sources.map((source, i) => (
                  <Chip
                    key={i}
                    label={
                      source.length > 20 ? `${source.slice(0, 17)}...` : source
                    }
                    size="small"
                    onClick={() => alert(`Full Source: ${source}`)}
                    sx={{ mr: 0.5, mb: 0.5, backgroundColor: "#C4D9FF" }}
                  />
                ))}
              </Box>
            )} */}
            {message.role === "assistant" &&
              index != 0 &&
              message.stackTrace && (
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label=" View Stack Trace"
                    size="small"
                    onClick={() => handleOpenModal(message.stackTrace)}
                    sx={{ mr: 0.5, mb: 0.5, backgroundColor: "#C4D9FF" }}
                  />
                </Box>
              )}
          </Box>
        </Box>
      ))}
      {isThinking && (
        <div className="flex items-stretch">
         <Avatar
                sx={{
                  ml: 0,
                  mr: 1,
                  bgcolor: "secondary.dark",
                  width: 30,
                  height: 30,
                }}
              >
                🤖
              </Avatar>
         <Box
          sx={{
            display: "flex",
            alignItems: "start",
            justifyContent: "start",
            mt: 0,
          }}
        >
        <ThinkingComponent isThinking={isThinking} />
          
        </Box>
        </div>
       
      )}
      {/* <div ref={messagesEndRef} /> */}
      {selectedStackTrace && (
        <StackTraceModal
          open={modalOpen}
          onClose={handleCloseModal}
          userQuery={selectedStackTrace.userQuery}
          chatbotResponse={selectedStackTrace.chatbotResponse}
          retrievedDocs={selectedStackTrace.retrievedDocs}
          inputTokens={selectedStackTrace.inputTokens}
          outputTokens={selectedStackTrace.outputTokens}
          queryTimestamp={selectedStackTrace.queryTimestamp}
          performanceMetrics={selectedStackTrace.performanceMetrics}
          model_name={selectedStackTrace.model_name}
          sources={selectedStackTrace.sources}
        />
      )}
    </Box>
  );
}

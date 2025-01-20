"use client";

import { useRef, useEffect, useState } from "react";
import { Box, Typography, Chip, Avatar, Button } from "@mui/material";
import StackTraceModal from "@/components/modal/StackTraceModal";
import ThinkingComponent from "../loader/ThinkingComponent";

const ChatMessages = ({ messages, isThinking }) => {
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
              backgroundColor:
                message.role === "user" ? "primary.main" : "secondary.main",
              color: "white",
              borderRadius: 2,
              p: 1,
            }}
          >
            <Typography variant="body1">{message.content}</Typography>
            {/* {message.sources && message.sources.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {message.sources.map((source, i) => (
                  <Chip
                    key={i}
                    label={source.length > 20 ? `${source.slice(0, 17)}...` : source}
                    size="small"
                    onClick={() => alert(`Full Source: ${source}`)}
                    sx={{ mr: 0.5, mb: 0.5, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  />
                ))}
              </Box>
            )} */}
            {message.role === "assistant" &&
              index != 0 &&
              message.stackTrace && (
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label="View Stack Trace"
                    size="small"
                    onClick={() => handleOpenModal(message.stackTrace)}
                    sx={{
                      mr: 0.5,
                      mb: 0.5,
                      backgroundColor: "rgba(255, 255, 255, 1)",
                    }}
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

      <div ref={messagesEndRef} />
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
};

export default ChatMessages;

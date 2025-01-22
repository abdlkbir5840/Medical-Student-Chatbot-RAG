"use client";

import { useRef, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  FormControl,
  Select,
} from "@mui/material";
import StackTraceModal from "@/components/modal/StackTraceModal";
import ThinkingComponent from "../loader/ThinkingComponent";
import {
  CopyAll,
  ThumbUp,
  ThumbDown,
  Translate,
  SwapHoriz,
  InfoOutlined,
  Autorenew,
} from "@mui/icons-material";
import ReactMarkdown from 'react-markdown';

const ChatMessages = ({ messages, isThinking, onTranslate }) => {
  const messagesEndRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStackTrace, setSelectedStackTrace] = useState(null);
  const [messageIndex, setMessageIndex] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMessage, setCurrentMessage] = useState(null);
  const languages = ["English", "Spanish", "French", "German", "Chinese"];

  const handleTranslateClick = (event, message, index) => {
    setMessageIndex(index);
    setAnchorEl(event.currentTarget);
    setCurrentMessage(message);
  };
  
  const handleTranslateClose = () => {
    setAnchorEl(null);
    setCurrentMessage(null);
  };

  const handleCopy = (message) => {
    navigator.clipboard.writeText(message.content);
    alert("Message copied to clipboard!");
  };

  const handleAction = (action, message) => {
    console.log(`Action: ${action}, Message: ${message.content}`);
    // Implement like/dislike functionality here
  };

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
        "&::-webkit-scrollbar": {
          display: "none",
        },
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
            <Typography variant="body1">
              <ReactMarkdown>
                {message.content}
              </ReactMarkdown>
              </Typography>
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
                  {/* <Chip
                    label="View Stack Trace"
                    size="small"
                    onClick={() => handleOpenModal(message.stackTrace)}
                    sx={{
                      mr: 0.5,
                      mb: 0.5,
                      backgroundColor: "rgba(255, 255, 255, 1)",
                    }}
                  /> */}
                  <Tooltip title="View Stack Trace" arrow>
                    <InfoOutlined
                      fontSize="small"
                      onClick={() => handleOpenModal(message.stackTrace)}
                      titleAccess="View Stack Trace"
                    />
                  </Tooltip>
                  <Tooltip title="Regenerate response" arrow>
                    <IconButton
                      onClick={() =>
                        handleAction("regenerate_response", message)
                      }
                      size="small"
                      sx={{ color: "white" }}
                    >
                      <Autorenew fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copy Message" arrow>
                    <IconButton
                      onClick={() => handleCopy(message)}
                      size="small"
                      sx={{ color: "white" }}
                    >
                      <CopyAll fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {/* <Tooltip title="Like Message" arrow>
                    <IconButton
                      onClick={() => handleAction("like", message)}
                      size="small"
                      sx={{ color: "white" }}
                    >
                      <ThumbUp fontSize="small" />
                    </IconButton>
                  </Tooltip> */}

                  {/* <Tooltip title="Dislike Message" arrow>
                    <IconButton
                      onClick={() => handleAction("dislike", message)}
                      size="small"
                      sx={{ color: "white" }}
                    >
                      <ThumbDown fontSize="small" />
                    </IconButton>
                  </Tooltip> */}

                  <Tooltip title="Translate Message" arrow>
                    <IconButton
                      onClick={(e) => handleTranslateClick(e, message.content, index)}
                      size="small"
                      sx={{ color: "white" }}
                    >
                      <Translate fontSize="small" />
                    </IconButton>
                  </Tooltip>
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
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleTranslateClose}
      >
        {languages.map((language, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              onTranslate(language, messageIndex, currentMessage)
              handleTranslateClose();
            }}
          >
            {language}
          </MenuItem>
        ))}
      </Menu>
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

import React, { useState, useEffect } from "react";
import { Avatar, Box, Typography, keyframes } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";

const pulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const ThinkingComponent = ({ isThinking }) => {
  const [thinkingText, setThinkingText] = useState("Thinking");
  const dots = ["", ".", "..", "...", "...."];

  useEffect(() => {
    if (!isThinking) return;

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % dots.length;
      setThinkingText("Thinking" + dots[index]);
    }, 400);

    return () => clearInterval(interval);
  }, [isThinking]);

  if (!isThinking) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
        mt: 2,
        p: 1.5,
        borderRadius: 2,
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        maxWidth: "fit-content",
      }}
    >
      
      <AutoAwesome
        sx={{
          fontSize: 18,
          color: "primary.main",
          mr: 1,
          animation: `${pulse} 1.5s ease-in-out infinite`,
        }}
      />
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: "text.secondary",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            right: -8,
            bottom: 2,
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "primary.main",
            animation: `${pulse} 0.8s ease-in-out infinite`,
          },
        }}
      >
        {thinkingText}
      </Typography>
      <AutoAwesome
        sx={{
          fontSize: 18,
          color: "primary.main",
          ml: 2,
          animation: `${pulse} 1.5s ease-in-out infinite`,
        }}
      />
    </Box>
  );
};

export default ThinkingComponent;

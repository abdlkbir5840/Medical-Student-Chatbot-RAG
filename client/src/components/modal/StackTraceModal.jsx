import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Paper,
  ThemeProvider,
  createTheme,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';

const theme = createTheme({
  palette: {
    primary: {
      main: "#3b82f6", // blue-500
    },
    secondary: {
      main: "#8b5cf6", // purple-500
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#f9fafb", // gray-50
        },
      },
    },
  },
});
// const performanceMetrics = {
//   totalTime: 1250,
//   retrievalTime: 300,
//   similarityTime: 200,
//   generationTime: 750,
//   resourceUtilization: {
//     memoryUsed: 512,
//     cpuUsage: 25
//   }
// }
const StackTraceModal = ({
  open,
  onClose,
  userQuery,
  chatbotResponse,
  retrievedDocs,
  inputTokens,
  outputTokens,
  queryTimestamp,
  performanceMetrics,
  model_name,
  sources,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="rag-info-modal"
        aria-describedby="rag-information-display"
      >
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: "65rem", // max-w-4xl
            maxHeight: "90vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              p: 3,
              background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Query Stack Trace
            </Typography>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                color: "white",
                "&:hover": { color: "rgba(255, 255, 255, 0.8)" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 3, overflowY: "auto", flexGrow: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Section title="User Query">
                <Typography variant="body1" color="text.secondary">
                  {userQuery}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Timestamp:</strong>{" "}
                  {queryTimestamp
                    ? new Date(queryTimestamp).toLocaleString()
                    : "Invalid Date"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>LLM:</strong> {model_name}
                </Typography>
              </Section>

              <Section title="Chatbot Response">
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ whiteSpace: "pre-line" }}
                  className="markdown-content"
                >
                  {chatbotResponse}
                  {/* <ReactMarkdown children={chatbotResponse} remarkPlugins={[remarkGfm]}/> */}
                </Typography>
              </Section>

              <Section title="Retrieved Documents">
                {retrievedDocs.map((doc, index) => (
                  <Paper
                    key={index}
                    elevation={1}
                    sx={{
                      p: 2,
                      mb: 2,
                      "&:hover": { boxShadow: 3 },
                      transition: "box-shadow 0.3s ease-in-out",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                    >
                      Document {index + 1}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {doc.content}
                    </Typography>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: "primary.light",
                          color: "white",
                          px: 1,
                          py: 0.5,
                          borderRadius: 10,
                        }}
                      >
                        Similarity: {doc.similarity.toFixed(4)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: "secondary.light",
                          color: "white",
                          px: 1,
                          py: 0.5,
                          borderRadius: 10,
                        }}
                      >
                        Source: {doc.source}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Section>
              <Section title="Resources">
                <Typography variant="body1" color="text.secondary">
                  Books referenced: {console.log(sources)}
                </Typography>
                <ul className="list-disc p-2">
                  {sources?.map((book, index) => (
                    <li key={index}>
                      <Typography variant="body2" color="text.secondary">
                        {book}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Section>
              <Section title="Tokens">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 3,
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="secondary.main"
                      gutterBottom
                    >
                      Total Tokens
                    </Typography>
                    <Typography variant="h4" color="text.primary">
                      {inputTokens + outputTokens}
                    </Typography>
                  </Paper>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" color="primary.main" gutterBottom>
                      Input Tokens
                    </Typography>
                    <Typography variant="h4" color="text.primary">
                      {inputTokens}
                    </Typography>
                  </Paper>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" color="primary.main" gutterBottom>
                      Output Tokens
                    </Typography>
                    <Typography variant="h4" color="text.primary">
                      {outputTokens}
                    </Typography>
                  </Paper>
                </Box>
              </Section>
              <Section title="Query Performance Metrics">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Total Processing Time:</strong>{" "}
                  {performanceMetrics.totalTime} ms
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Breakdown:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Retrieval Time: {performanceMetrics.retrievalTime} ms
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Response Generation Time:{" "}
                  {performanceMetrics.generationTime} ms
                </Typography>
                {/* {performanceMetrics.resourceUtilization && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Resource Utilization:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Memory Used: 1025 MB
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • CPU Usage: 76%
                    </Typography>
                  </>
                )} */}
              </Section>
            </Box>
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

const Section = ({ title, children }) => (
  <Box>
    <Typography variant="h6" color="text.primary" gutterBottom>
      {title}
    </Typography>
    <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: "grey.200" }}>
      {children}
    </Paper>
  </Box>
);

export default StackTraceModal;

import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    // primary: {
    //   main: "#3f51b5", // Indigo
    // },
    // secondary: {
    //   main: "#f50057", // Pink
    // },
    primary: {
      main: "#4caf50", // Green (for AI chatbot messages)
    },
    secondary: {
      main: "#2196f3", // Blue (for user messages)
    },
    
    
    
    
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
})

export default theme


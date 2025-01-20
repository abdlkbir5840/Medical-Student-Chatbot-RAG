import { useState, useEffect, useRef } from "react";
import {
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  LinearProgress,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { PieChart } from "@mui/x-charts/PieChart";

import {
  CoinsIcon as Tokens,
  FileUp,
  MessageCircle,
  Clock,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { publicAxios } from "../../app/api/config";
import {
  GTE_PDFS,
  SERVER,
  GTE_PDF,
  GET_USER_LLM_STATS,
} from "../../app/api/routes";

// Mock data (replace with real data in production)
const stats = {
  consumedTokens: 15000,
  inputTokens: 7500,
  outputTokens: 7500,
  questionsAsked: 50,
  filesUploaded: 10,
};
// const analytics = [
//   {
//     model: "Model A",
//     nbrQuestion: 4,
//     inputTokens: 3,
//     outputTokens: 5,
//   },
//   {
//     model: "Model B",
//     nbrQuestion: 3,
//     inputTokens: 6,
//     outputTokens: 5,
//   },
//   {
//     model: "Model C",
//     nbrQuestion: 5,
//     inputTokens: 3,
//     outputTokens: 6,
//   },
// ];
const dataset = [
  {
    model: "Model A",
    nbrQuestion: 4,
  },
  {
    model: "Model B",
    nbrQuestion: 3,
  },
  {
    model: "Model C",
    nbrQuestion: 5,
  },
];
const activityHistory = [
  { action: "Asked a question", time: "2 minutes ago" },
  { action: "Uploaded a file", time: "1 hour ago" },
  { action: "Summarized a document", time: "3 hours ago" },
  { action: "Translated a text", time: "1 day ago" },
  { action: "Generated speech", time: "2 days ago" },
];
// const pdfFiles = [
//   { name: "Document 1", size: "2 MB", uploadedAt: "2025-01-10" },
//   { name: "Document 2", size: "1.5 MB", uploadedAt: "2025-01-12" },
//   { name: "Document 3", size: "3.2 MB", uploadedAt: "2025-01-14" },
// ];
const chartSetting = {
  yAxis: [
    {
      label: "Value",
    },
  ],
  width: 780,
  height: 300,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: "translate(-12px, 0)",
    },
  },
};

const chartSetting_2 = {
  xAxis: [
    {
      label: 'Number of Questions',
    },
  ],
  width: 570,
  height: 300,
};
const StatCard = ({ title, value, icon: Icon, color }) => (
  <Paper
    elevation={10}
    sx={{
      p: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      backgroundColor: color,
    }}
  >
    <Box style={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        component="h3"
        style={{
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
        }}
      >
        <Icon size={25} style={{ marginRight: "16px" }} />
        {title}
      </Typography>
      <Typography variant="h4" component="p" style={{ color: "#FFFFFF" }}>
        {value?.toLocaleString()}
      </Typography>
    </Box>
  </Paper>
);

const formatUploadedAt = (uploadedAt) => {
  const date = new Date(uploadedAt);
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(date);
};
const Dashboard = () => {
  const [userId, setUserId] = useState();
  const [pdfFiles, setPdfFiles] = useState([]);
  const [stats, setStats] = useState({});
  const [analytics, setAnalytics] = useState([]);
  const transformedAnalytics = analytics.map((item) => ({
    ...item,
    shortModel: item.model.substring(0, 10), // Add shortened name for display
  }));
  const fetchUserPdfs = () => {
    publicAxios
      .get(GTE_PDFS(userId))
      .then((response) => {
        setPdfFiles(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const fetchUserLLMStats = () => {
    publicAxios
      .get(GET_USER_LLM_STATS(userId))
      .then((response) => {
        setStats(response.data.stats);
        setAnalytics(response.data.analytics);
        console.log(response.data.analytics);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("test 11");
    if (userId) {
      console.log("test");
      setUserId(userId);
      // fetchUserPdfs();
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserPdfs();
      fetchUserLLMStats();
    }
  }, [userId]);
  return (
    <Box sx={{ flexGrow: 1, mt: 2 }}>
      <Grid container spacing={3}>
        {stats && (
          <Grid item xs={12} md={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Consumed Tokens"
                  value={stats.consumedTokens}
                  icon={Tokens}
                  color="#ff758f" // Rose ciel
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Input Tokens"
                  value={stats.inputTokens}
                  icon={ArrowUpCircle}
                  color="#6a5acd" // Bleu lavande
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Output Tokens"
                  value={stats.outputTokens}
                  icon={ArrowDownCircle}
                  color="#ffb347" // Orange pêche
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Questions Asked"
                  value={stats.questionsAsked}
                  icon={MessageCircle}
                  color="#69c9d0" // Bleu turquoise
                />
              </Grid>
            </Grid>
          </Grid>
        )}
        {analytics && (
          <Grid item xs={12} md={7}>
            <Paper elevation={10} sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" component="h3" gutterBottom>
                Usage Trends
              </Typography>
              <BarChart
                dataset={analytics}
                xAxis={[{ scaleType: "band", dataKey: "model" }]}
                series={[
                  // {
                  //   dataKey: "nbrQuestion",
                  //   label: "Questions",
                  //   color: "#ff758f", // Rose ciel
                  // },
                  {
                    dataKey: "inputTokens",
                    label: "Input Tokens",
                    color: "#6a5acd", // Bleu lavande
                  },
                  {
                    dataKey: "outputTokens",
                    label: "Output Tokens",
                    color: "#ffb347", // Orange pêche
                  },
                ]}
                {...chartSetting}
              />
            </Paper>
          </Grid>
        )}
        {analytics && (
          <Grid item xs={12} md={5}>
            <Paper elevation={10} sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" component="h3" gutterBottom>
                Questions Asked
              </Typography>
              <BarChart
                dataset={analytics}
                yAxis={[{ scaleType: 'band', dataKey: 'model' }]}
                series={[{ dataKey: 'nbrQuestion', label: 'Number of Questions' }]}
                layout="horizontal"
                grid={{ vertical: true }}
                {...chartSetting_2}
              />
            </Paper>
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <Paper elevation={10} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" component="h3" gutterBottom>
              PDF Files Uploaded
            </Typography>
            <List>
              {pdfFiles &&
                pdfFiles.map((file, index) => (
                  <a
                    key={index}
                    href={`http://${SERVER}${GTE_PDF(userId, file.indexName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "blue")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "inherit")
                    }
                  >
                    <ListItem disablePadding>
                      <ListItemIcon style={{ color: "blue" }}>
                        <FileUp size={20} />
                      </ListItemIcon>

                      <ListItemText
                        primary={file.name}
                        secondary={`Size: ${file.size}, Uploaded At: ${formatUploadedAt(file.uploadedAt)}`}
                        primaryTypographyProps={{ variant: "body2" }}
                        secondaryTypographyProps={{ variant: "caption" }}
                      />
                    </ListItem>
                  </a>
                ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={10} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" component="h3" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {activityHistory.map((activity, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemIcon>
                    <Clock size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.action}
                    secondary={activity.time}
                    primaryTypographyProps={{ variant: "body2" }}
                    secondaryTypographyProps={{ variant: "caption" }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

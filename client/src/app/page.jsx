'use client'
import React, { useEffect, useState } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import { Container, Box, Typography, Toolbar } from '@mui/material';
import Navbar from '@/components/navbar/Navbar';
import Sidebar from "@/components/navbar/Sidebar"

import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
   const [userId, setUserId] = useState();
   const [sidebarOpen, setSidebarOpen] = useState(false)
   const toggleSidebar = () => {
    console.log(sidebarOpen);
    setSidebarOpen(!sidebarOpen)
  }

    useEffect(() => {
      setUserId(localStorage.getItem('userId'));
    }, []);
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const processId = userId;
    const ws = new WebSocket(`ws://localhost:8000/ws/${processId}`);
    // socketRef.current = ws;
    // console.log(socketRef.current);
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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
    <Navbar toggleSidebar={toggleSidebar} />
    <Toolbar />
    <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
        <Container maxWidth="xlg" sx={{ mt: 4, display: "flex", flexDirection: "column" }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
            🩺 Welcome to MediChat AI
          </Typography>
          <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
            Here's an overview of your activity and usage:
          </Typography>
          <Dashboard />
        </Container>
      </Box>
    </Box>
  </Box>
  );
};

export default Home;


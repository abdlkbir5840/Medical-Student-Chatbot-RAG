"use client";
import React, { useState } from 'react';

import { Toolbar } from "@mui/material";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/navbar/Sidebar"

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
    const toggleSidebar = () => {
     console.log(sidebarOpen);
     setSidebarOpen(!sidebarOpen)
   }
  return (
    <div>
      <Navbar toggleSidebar={toggleSidebar}/>
            <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
      
      <Toolbar />
      <main>{children}</main>
    </div>
  );
}

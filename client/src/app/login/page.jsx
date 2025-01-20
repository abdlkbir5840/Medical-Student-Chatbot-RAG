"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
} from "@mui/material";
import Link from "next/link";
import MedicalLogo from "@/components/logo/MedicalLogo";
import { publicAxios } from "../api/config";
import { useRouter } from "next/navigation";
import {LOGIN} from "../api/routes"
export default function LoginPage() {
    const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const handleSubmit = async(event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      const response = await publicAxios.post(LOGIN, { email, password });
      if (response.status === 200) {
        const {message, accessToken, userId, email} = response.data
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userId", userId);
        localStorage.setItem("email", email);
        router.push("/");
      }else{
        setErrorMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      if(error.response && error.response.status === 401) {
        setErrorMessage(error.response.data.message);
      }else{
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <MedicalLogo />
            <Typography
              variant="h4"
              component="h1"
              className="mt-2 text-primary"
            >
              MedStudent AI
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600">
              Your AI-powered medical study companion
            </Typography>
          </div>
          {errorMessage && (
            <Alert severity="error" className="mb-4">
              {errorMessage}
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              required
              type="email"
              name="email"
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              required
              type="password"
              name="password"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="bg-primary hover:bg-primary-dark"
            >
              Login
            </Button>
          </form>
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <Typography variant="body2" className="text-center text-gray-700">
              MedStudent AI uses advanced natural language processing to help
              medical students study more effectively.
            </Typography>
          </div>
          <Typography variant="body2" className="text-center">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

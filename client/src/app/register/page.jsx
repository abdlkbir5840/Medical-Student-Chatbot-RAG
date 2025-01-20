"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
} from "@mui/material";
import Link from "next/link";
import MedicalLogo from "@/components/logo/MedicalLogo";
import { REGISTER } from "../api/routes";
import { publicAxios } from "../api/config";
import { useRouter } from "next/navigation";
export default function RegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const age = formData.get("age");
    const email = formData.get("email");
    const password = formData.get("password");
    const university = formData.get("university");
    const speciality = formData.get("speciality");
    const confirmPassword = formData.get("confirmPassword");

    // Simulated validation logic
    if (
      !firstName ||
      !lastName ||
      !age ||
      !email ||
      !password ||
      !confirmPassword ||
      !university ||
      !speciality
    ) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    const data = {
      firstName: firstName,
      lastName: lastName,
      age: age,
      email: email,
      password: password,
      university: university,
      speciality: speciality,
    };

    try {
      const response = await publicAxios.post(REGISTER, data);
      if (response.status === 200) {
        const { message, savedUser } = response.data;
        console.log(message);
        console.log(savedUser);
        router.push("/login");
      } else {
        setErrorMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-xl">
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <MedicalLogo />
            <Typography
              variant="h4"
              component="h1"
              className="mt-2 text-primary"
            >
              Join MedStudent AI
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600">
              Start your AI-powered medical study journey
            </Typography>
          </div>

          {/* Display error message if it exists */}
          {errorMessage && (
            <Alert severity="error" className="mb-4">
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  required
                  name="firstName"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  required
                  name="lastName"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Age"
                  variant="outlined"
                  fullWidth
                  required
                  type="number"
                  name="age"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  required
                  type="email"
                  name="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="University"
                  variant="outlined"
                  fullWidth
                  required
                  name="university"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Speciality"
                  variant="outlined"
                  fullWidth
                  required
                  name="speciality"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  required
                  type="password"
                  name="password"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  fullWidth
                  required
                  type="password"
                  name="confirmPassword"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="bg-primary hover:bg-primary-dark"
            >
              Register
            </Button>
          </form>
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <Typography variant="body2" className="text-center text-gray-700">
              Join thousands of medical students using AI to enhance their
              learning and prepare for exams more effectively.
            </Typography>
          </div>
          <Typography variant="body2" className="text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

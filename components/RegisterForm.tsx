// components/RegisterForm.tsx

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import {
  Alert,
  Button,
  Snackbar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link as MuiLink,
  IconButton,
} from "@mui/material";
import PasswordStrengthBar from "react-password-strength-bar";
import Link from "next/link";
import { ArrowForward, Visibility, VisibilityOff } from "@mui/icons-material";
import MountainBackground from "./MountainBackground";

const FIXED_FLOAT_AFFILIATE_LINK = "https://ff.io/";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required");
      return false;
    }
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setError("Invalid email format");
      return false;
    }
    if (password.trim().length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (!agreedToTerms) {
      setError("You must agree to the terms and conditions");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await handleRegistration();
    }
  };

  const handleRegistration = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/v1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        //Sending automatically to the login page, doesnt give the time
        //for the message o sucessful registration
        //router.push("/login")
        
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MountainBackground isLoading={isLoading} isSuccess={isSuccess} />
      <div className="flex min-h-screen flex-col items-center justify-center py-2 register-form-container">
        <div className="relative z-10">
          <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
            <h1 className="text-4xl font-bold mb-8">Registration</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md">
              {error && (
                <Alert severity="error" className="mb-4">
                  {error}
                </Alert>
              )}
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 mb-4 border rounded bg-slate-800 border-slate-600 focus:border-blue-500 focus:ring-blue-500 text-white"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mb-4 border rounded bg-slate-800 border-slate-600 focus:border-blue-500 focus:ring-blue-500 text-white"
                required
              />
              <div className="relative mb-4">
                <div className="flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded bg-slate-800 border-slate-600 focus:border-blue-500 focus:ring-blue-500 text-white"
                    required
                  />
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2"
                    style={{ color: "white" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </div>
              </div>
              <PasswordStrengthBar password={password} />
              <div className="flex items-center mb-4">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={agreedToTerms}
                      onChange={() => setAgreedToTerms(!agreedToTerms)}
                    />
                    <div
                      className={`w-6 h-6 bg-slate-700 rounded-md border ${agreedToTerms ? "border-blue-500" : "border-slate-500"} transition-all duration-200 ease-in-out`}
                    >
                      <svg
                        className={`w-6 h-6 text-blue-500 pointer-events-none ${agreedToTerms ? "opacity-100" : "opacity-0"} transition-opacity duration-200 ease-in-out`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <span className="ml-2 text-sm text-slate-300">
                    I agree to the terms and conditions
                  </span>
                </label>
              </div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isLoading}
                className="mb-4"
              >
                {isLoading ? "Processing..." : "Register"}
              </Button>
            </form>
            <p className="mt-4 text-slate-300">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500">
                Login
              </Link>
            </p>
          </main>
            <Snackbar
              open={isSuccess}
              autoHideDuration={3000}
              onClose={() => setIsSuccess(false)}
              message="Registration successful! Please check your email to verify your account."
            />
        </div>
      </div>
    </Suspense>
  );
}

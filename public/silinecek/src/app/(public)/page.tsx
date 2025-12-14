"use client";

import Image from "next/image";
import logo from "@/assets/logo.png";
import { ArrowRight } from "lucide-react";
import React from "react";
import Link from "next/link";
import "@/style.css";

export default function Home() {
  return (
    <div className="background">
      <div className="background-top"></div>
      <div className="logo"></div>

      <div className="custom-layout">
        <div
          className="content-bg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            minHeight: "calc(100vh - 160px)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          {/* Compact Main Container */}
          <div className="w-full max-w-4xl mx-auto">
            {/* Compact Grid Layout */}
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Logo & Content */}
              <div className="text-center lg:text-left">
                {/* Compact Logo */}
                <div className="mb-4">
                  <div className="inline-block p-2 rounded-lg bg-gradient-to-br from-blue-50 to-red-50 shadow-sm mb-3 border border-white/50">
                    <Image
                      src={logo}
                      alt="StudyScore"
                      className="h-10 w-auto"
                      priority
                    />
                  </div>
                </div>

                {/* Compact Title */}
                <h1
                  style={{
                    color: "#092e5e",
                    fontSize: "32px",
                    fontWeight: "300",
                    marginBottom: "8px",
                    lineHeight: "1.2",
                  }}
                >
                  StudyScore Platform
                </h1>

                {/* Compact Subtitle */}
                <p
                  style={{
                    color: "rgba(9, 46, 94, 0.6)",
                    fontSize: "16px",
                    fontWeight: "300",
                    marginBottom: "16px",
                    lineHeight: "1.4",
                  }}
                >
                  AI-powered personalized learning experience
                </p>
              </div>

              {/* Right Side - Compact Login Card */}
              <div className="flex justify-center">
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(15px)",
                    borderRadius: "16px",
                    padding: "24px",
                    boxShadow: "0 12px 24px rgba(9, 46, 94, 0.08)",
                    border: "1px solid rgba(183, 17, 61, 0.1)",
                    width: "100%",
                    maxWidth: "300px",
                  }}
                >
                  {/* Compact Welcome */}
                  <div className="text-center mb-4">
                    <h2
                      style={{
                        color: "#092e5e",
                        fontSize: "22px",
                        fontWeight: "400",
                        marginBottom: "4px",
                      }}
                    >
                      Welcome Back
                    </h2>
                    <p
                      style={{
                        color: "rgba(9, 46, 94, 0.6)",
                        fontSize: "14px",
                        fontWeight: "300",
                      }}
                    >
                      Continue learning
                    </p>
                  </div>

                  {/* Compact Login Button */}
                  <Link
                    href="/login"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      padding: "12px 20px",
                      background:
                        "linear-gradient(135deg, #092e5e 0%, #b7113d 100%)",
                      color: "white",
                      fontSize: "15px",
                      fontWeight: "400",
                      borderRadius: "10px",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                      boxShadow: "0 6px 16px rgba(183, 17, 61, 0.2)",
                      marginBottom: "16px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(183, 17, 61, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 16px rgba(183, 17, 61, 0.2)";
                    }}
                  >
                    Sign In
                    <ArrowRight
                      style={{
                        marginLeft: "8px",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </Link>

                  {/* Compact Links */}
                  <div className="text-center space-y-2">
                    <Link
                      href="/register"
                      style={{
                        color: "#b7113d",
                        textDecoration: "none",
                        fontSize: "13px",
                        fontWeight: "400",
                        display: "block",
                      }}
                    >
                      Create Account
                    </Link>

                    <Link
                      href="/forgot-password"
                      style={{
                        color: "rgba(9, 46, 94, 0.5)",
                        textDecoration: "none",
                        fontSize: "12px",
                        fontWeight: "300",
                        display: "block",
                      }}
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Footer */}
          <p
            className="content-info-bottom-text"
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              margin: "0",
              fontSize: "11px",
            }}
          >
            Powered by NISH / © 2025 StudyScore
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { FormEvent, useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/auth-context";
import { useRouter, useSearchParams } from "next/navigation";

import "@/style.css";

export default function CorporateLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { login, isAuthenticated, getPathByRole } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  console.log(error);

  const redirectTo = searchParams?.get("redirectTo") || "";

  useEffect(() => {
    if (isAuthenticated) {
      if (redirectTo) {
        router.replace(redirectTo);
      } else {
        router.replace(getPathByRole());
      }
    }
  }, [isAuthenticated, router, getPathByRole, redirectTo]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Lütfen kullanıcı adı ve şifre giriniz.");
      return;
    }

    setError("");
    setIsLoggingIn(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setError("Login failed. Please check your username and password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again later.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      <>
        <a href="index.html" className="logo"></a>

        <div className="custom-layout">
          <div className="content-bg" style={{ backgroundColor: "#0000003b" }}>
            <div
              className="custom-scrollable-content"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100%",
              }}
            >
              <div className="login-container">
                <h2>Hoşgeldin</h2>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    id="username"
                    placeholder="E posta adresin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoggingIn}
                    required
                    style={{
                      marginBottom: "15px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      fontSize: "16px",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  />

                  <input
                    type="password"
                    id="password"
                    placeholder="Şifren"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoggingIn}
                    required
                    style={{
                      paddingTop: "16px",
                      paddingBottom: "16px",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                      marginBottom: "15px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      fontSize: "16px",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  />

                  {error && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "14px",
                        marginBottom: "10px",
                        textAlign: "center",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={isLoggingIn}>
                    {isLoggingIn ? "Giriş yapılıyor..." : "Giriş"}
                  </button>
                </form>
              </div>

              <button className="forgot-button">Şifremi Unuttum</button>
            </div>
            <p className="content-info-bottom-text">
              Powered by NISH / © 2025 StudyScore
            </p>
          </div>

          <div className="background-top"></div>
        </div>
      </>
    </>
  );
}

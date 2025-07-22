"use client"

import React, { useEffect, useState } from 'react'

declare global {
  interface Window {
    botpress?: {
      init: (config: Record<string, unknown>) => void
    }
  }
}

interface BotpressProviderProps {
  children: React.ReactNode
}

export function BotpressProvider({ children }: BotpressProviderProps) {
  const [jwt, setJwt] = useState("");

  useEffect(() => {
    // Create and append the script
    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
    script.async = true;
    script.id = "botpress-script";
    document.body.appendChild(script);

    // Initialize Botpress after script loads
    script.onload = () => {
      window.botpress?.init({
        "botId": "b7434d3e-7226-485e-81a0-6d9a44c35339",
        "configuration": {
          "website": {},
          "email": {},
          "phone": {},
          "termsOfService": {},
          "privacyPolicy": {},
          botName: "Stamp Expert",
          botDescription: "Stamp Expert is a bot that can help you with your stamp related questions.",
          "showCloseButton": false,
          "showPoweredBy": false,
          "color": "#ff8904",
          "variant": "solid",
          "themeMode": "light",
          "fontFamily": "inter",
          "radius": 2,
          "containerWidth": "800px",
        },
        ...(jwt ? {
          user: {
            data: {
              "authorization": `Bearer ${jwt}`
            }
          }
        } : {}),
        "clientId": "75ef7c5c-2bbe-4fa8-9bda-5f64f0e38d68"
      });
    };

    // Cleanup function
    return () => {
      // Only remove script if it exists in the DOM
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const userData = localStorage.getItem("stamp_user_data");
      if (userData) {
        const userDataObj = JSON.parse(userData);
        if (userDataObj.jwt && jwt !== userDataObj.jwt) {
          setJwt(userDataObj.jwt);
          (window.botpress as Record<string, any>)?.updateUser?.({
            data: {
              "authorization": `Bearer ${userDataObj.jwt}`
            }
          });
        } else if (jwt && !userDataObj.jwt) {
          setJwt("");
          (window.botpress as Record<string, any>)?.updateUser?.({
            data: {
              "authorization": ``
            }
          });
        }
      }
    }, 5 * 1000);

    return () => clearInterval(timer);
  }, [])

  return <>{children}</>;
} 
"use client"

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    botpress?: {
      init: (config: any) => void
    }
  }
}

interface BotpressProviderProps {
  children: React.ReactNode
}

export function BotpressProvider({ children }: BotpressProviderProps) {
  const [jwt, setJwt] = useState("");

  useEffect(() => {
    // Remove existing script if it exists
    const existingScript = document.getElementById("botpress-script");
    if (existingScript) {
      existingScript.remove();
    }

    // Create and append the script
    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
    script.async = true;
    script.id = "botpress-script";
    document.body.appendChild(script);

    // Initialize Botpress after script loads
    script.onload = () => {
      window.botpress?.init({
        "botId": "0ea616a3-48f1-45b7-9930-36c973910468",
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
        user: {
          data: {
            "authorization": `Bearer ${jwt}`
          }
        },
        "clientId": "8c56712b-5a68-4273-9899-e9ff47bd98ce"
      });
    };

    // Cleanup function
    return () => {
      // Only remove script if it exists in the DOM
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [jwt]);

  useEffect(() => {
    const timer = setInterval(() => {
      const userData = localStorage.getItem("stamp_user_data");
      if (userData) {
        const userDataObj = JSON.parse(userData);
        if (userDataObj.jwt && jwt !== userDataObj.jwt) {
          setJwt(userDataObj.jwt);
        }
      }
    }, 30 * 1000);

    return () => clearInterval(timer);
  },[])

  return <>{children}</>;
} 
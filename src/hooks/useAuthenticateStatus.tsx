import React, { useState, useEffect } from "react";

export default function useAuthenticateStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      let parsedToken = JSON.parse(access_token!);
      let exp = Number(parsedToken.expiration);
      if (exp > Date.now() / 1000) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  }, []);
  return isAuthenticated;
}

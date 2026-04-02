import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in URL (from OAuth callback)
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    const returnTo = localStorage.getItem("auth_return_to");
    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      localStorage.removeItem("auth_return_to");
      // Redirect to the page user was on before OAuth (e.g. /analytics)
      if (returnTo && returnTo !== window.location.pathname) {
        window.location.replace(returnTo);
        return; // Stop — page will reload at the correct path
      }
      window.history.replaceState({}, "", window.location.pathname);
    }

    // Validate existing token
    const token = localStorage.getItem("token");
    if (token) {
      api.getMe()
        .then((data) => {
          setUser(data.user);
          // Migrate IP-based analytics history to this account on OAuth callback
          if (tokenFromUrl) {
            api.migrateHistory().catch(() => {});
          }
        })
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async () => {
    // Save current page so we can return after OAuth
    localStorage.setItem("auth_return_to", window.location.pathname);
    const { url } = await api.getAuthUrl();
    window.location.href = url;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

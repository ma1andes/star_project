import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        console.log("No auth token found");
        setUser(null);
        return;
      }
      
      const res = await fetch("http://127.0.0.1:8000/api/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        console.error("Failed to fetch user, status:", res.status);
        setUser(null);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("role");
      }
    } catch (err) {
      console.error("Failed to connect to server: ", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    setUser,
    fetchUser,
    loading
  };


  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

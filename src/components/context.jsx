import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// Create the context
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [oneUser, setOneUser] = useState([]);
  const [user, setUser] = useState(null); // Example state
  const [theme, setTheme] = useState("light"); // Example state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const nav = useNavigate();
  // Method to login (this could be after successful authentication)

  const login = () => {
    setIsAuthenticated(true); // Set to true after successful login
  };

  // Method to logout
  const logout = () => {
    setIsAuthenticated(false); // Set to false when the user logs out
    nav("/");
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        oneUser,
        setOneUser,
        login,
        logout,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

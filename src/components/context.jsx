import { createContext, useState } from "react";

// Create the context
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [oneUser, setOneUser] = useState([]);
  const [user, setUser] = useState(null); // Example state
  const [theme, setTheme] = useState("light"); // Example state

  const login = (newUser) => {
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <AppContext.Provider
      value={{ user, oneUser, setOneUser, login, logout, theme, toggleTheme }}
    >
      {children}
    </AppContext.Provider>
  );
};

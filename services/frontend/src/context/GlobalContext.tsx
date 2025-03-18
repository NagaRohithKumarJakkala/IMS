"use client"; // Required in Next.js App Router

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the structure of the global state
interface GlobalContextType {
  projectName: string;
  branchName: string;
  branchId: string;
  username: string;
  setProjectName: (value: string) => void;
  setBranchName: (value: string) => void;
  setBranchId: (value: string) => void;
  setUsername: (value: string) => void;
}

// Create the context
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Provider component
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [projectName, setProjectName] = useState<string>("");
  const [branchName, setBranchName] = useState<string>("");
  const [branchId, setBranchId] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  // Load from localStorage when the component mounts
  useEffect(() => {
    const storedProjectName = localStorage.getItem("projectName");
    const storedBranchName = localStorage.getItem("branchName");
    const storedBranchId = localStorage.getItem("branchId");
    const storedUsername = localStorage.getItem("username");

    if (storedProjectName) setProjectName(storedProjectName);
    if (storedBranchName) setBranchName(storedBranchName);
    if (storedBranchId) setBranchId(storedBranchId);
    if (storedUsername) setUsername(storedUsername);
  }, []);

  // Function to update localStorage along with state
  const updateProjectName = (value: string) => {
    setProjectName(value);
    localStorage.setItem("projectName", value);
  };

  const updateBranchName = (value: string) => {
    setBranchName(value);
    localStorage.setItem("branchName", value);
  };

  const updateBranchId = (value: string) => {
    setBranchId(value);
    localStorage.setItem("branchId", value);
  };

  const updateUsername = (value: string) => {
    setUsername(value);
    localStorage.setItem("username", value);
  };

  return (
    <GlobalContext.Provider
      value={{
        projectName,
        branchName,
        branchId,
        username,
        setProjectName: updateProjectName,
        setBranchName: updateBranchName,
        setBranchId: updateBranchId,
        setUsername: updateUsername,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Custom Hook to use Context
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

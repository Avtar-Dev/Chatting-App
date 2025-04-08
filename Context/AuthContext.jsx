import { createContext, useEffect, useState } from "react";
import { firebaseAuth } from "./FirebaseContext";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, fileName, setFileName }}
    >
      {children}
    </AuthContext.Provider>
  );
};

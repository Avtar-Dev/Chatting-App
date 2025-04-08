import { createContext, useContext, useReducer, useState } from "react";
import { AuthContext } from "./AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./FirebaseContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [status, setStatus] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const updateIsOnlineField = async () => {
    const docRef = doc(db, "users", currentUser.uid);
    await updateDoc(docRef, { online: true });
  };

  const handleOffline = async () => {
    const docRef = doc(db, "users", currentUser.uid);
    await updateDoc(docRef, { online: false });
  };
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          ...state,
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider
      value={{
        data: state,
        dispatch,
        updateIsOnlineField,
        handleOffline,
        status,
        setStatus,
      }}>
      {children}
    </ChatContext.Provider>
  );
};

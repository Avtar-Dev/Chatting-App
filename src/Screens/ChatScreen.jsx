import React, { useContext, useEffect, useState } from "react";
import MyMsg from "../Components/MyMsg";
import UserMsg from "../Components/UserMsg";
import SendMsg from "../Components/SendMsg";
import UserName from "../Components/UserName";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../Context/FirebaseContext";
import { useNavigate } from "react-router-dom";
import { isEmptyObject } from "../utils/EmpObj";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (isEmptyObject(currentUser)) {
      navigate("/chatlist");
    }

    if (!data.chatId) return;

    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => unSub();
  }, [data.chatId]);

  return (
    <div className="bg-amber-50  w-auto flex flex-col">
      <UserName currentUser={currentUser} />
      <div className="space-y-1 mt-10 mb-10 flex flex-col min-h-screen">
        {messages?.map((m) =>
          m.senderId === currentUser.uid ? (
            <MyMsg message={m} key={m.id} />
          ) : (
            <UserMsg message={m} key={m.id} />
          )
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white">
        <SendMsg />
      </div>
    </div>
  );
};

export default ChatScreen;

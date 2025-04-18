import React, { useContext, useEffect, useRef, useState } from "react";
import ChatRow from "../Components/ChatRow";
import Search from "../Components/Search";
import ChatSearch from "../Components/ChatSearch";
import { signOut } from "firebase/auth";
import { db, firebaseAuth } from "../../Context/FirebaseContext";
import { AuthContext } from "../../Context/AuthContext";
import {
  doc,
  onSnapshot,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ChatContext } from "../../Context/ChatContext";
import { useNavigate } from "react-router-dom";

const ChatList = () => {
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const [chats, setChats] = useState({});
  const [UserName, setUserName] = useState("");

  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const { updateIsOnlineField, handleOffline } = useContext(ChatContext);
  console.log("photo", currentUser?.photoURL);

  const navigate = useNavigate();
  const backPressCount = useRef(0);

  useEffect(() => {
    updateIsOnlineField();
  }, []);

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();

      if (backPressCount.current === 1) {
        console.log("Double-tap detected! Running function...");
        handleOffline();
        window.history.back();
      } else {
        backPressCount.current = 1;
        setTimeout(() => (backPressCount.current = 0), 1000);
      }

      window.history.pushState(null, "", window.location.pathname);
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [backPressCount]);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
      setChats(doc.data() || {});
    });

    return () => unsub();
  }, [currentUser?.uid]);

  const handleSelect = async (selectedUser) => {
    if (!selectedUser?.uid) return;

    const combinedId =
      currentUser.uid > selectedUser.uid
        ? currentUser.uid + selectedUser.uid
        : selectedUser.uid + currentUser.uid;

    try {
      const chatDoc = doc(db, "chats", combinedId);
      const chatExists = await getDoc(chatDoc);

      if (!chatExists.exists()) {
        await setDoc(chatDoc, { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [`${combinedId}.userInfo`]: {
            uid: selectedUser.uid,
            displayName: selectedUser.displayName,
            photoURL: selectedUser.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", selectedUser.uid), {
          [`${combinedId}.userInfo`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });
      }

      dispatch({ type: "CHANGE_USER", payload: selectedUser });
      navigate("/chatscreen");
    } catch (error) {
      console.error("Error selecting chat:", error);
    }
  };

  const handleSelectChat = (userInfo) => {
    if (!userInfo?.uid) return;

    dispatch({ type: "CHANGE_USER", payload: userInfo });
    navigate("/chatscreen");
  };

  const filteredChats = UserName
    ? Object.entries(chats).filter(
        ([, chat]) => chat.userInfo.displayName === UserName
      )
    : Object.entries(chats);

  return (
    <div className="flex flex-col bg-amber-100 h-screen">
      <div className="flex justify-between items-center p-2">
        <div className="flex items-center gap-1">
          <img
            src={
              currentUser?.photoURL == null
                ? "not-upload.png"
                : currentUser?.photoURL
            }
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <p className="font-bold text-xl">
            {currentUser?.displayName || "Unknown User"}
          </p>
        </div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <button
          className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
          onClick={() => {
            setCurrentUser({});
            handleOffline();
            signOut(firebaseAuth);
          }}>
          Logout
        </button>
      </div>

      <Search
        setUser={setUser}
        setErr={setErr}
        UserName={UserName}
        setUserName={setUserName}
      />

      {err && (
        <span className="flex items-center justify-center">
          User not found!
        </span>
      )}

      {user &&
      !filteredChats.some(([_, chat]) => chat.userInfo.uid === user.uid) ? (
        <div onClick={() => handleSelect(user)}>
          <ChatSearch
            user={user}
            err={err}
            setUserName={setUserName}
            setUser={setUser}
            handleSelect={handleSelect}
          />
        </div>
      ) : null}

      <div className="bg-amber-100">
        {filteredChats
          ?.sort((a, b) => b[1].date - a[1].date)
          .map(([chatId, chat]) => {
            const userInfo = chat?.userInfo || {};

            return (
              <div key={chatId} onClick={() => handleSelectChat(userInfo)}>
                <ChatRow
                  dp={userInfo.photoURL}
                  name={userInfo.displayName || "Unknown User"}
                  msg={chat.lastMessage?.text || ""}
                  chat={chat}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ChatList;

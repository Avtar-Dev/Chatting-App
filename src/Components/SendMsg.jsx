import React, { useContext, useEffect, useRef, useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { ChatContext } from "../../Context/ChatContext";
import { AuthContext } from "../../Context/AuthContext";
import { v4 as uuid } from "uuid";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../Context/FirebaseContext";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const SendMsg = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [emojiData, setEmojiData] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { data: chatData } = useContext(ChatContext);

  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji.native);
  };

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSend = async () => {
    if (!text.trim() && !img) return;

    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error uploading image:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await sendMessage(downloadURL);
        }
      );
    } else {
      await sendMessage();
    }

    setText("");
    setImg(null);
    setEmojiData(false);
  };

  const sendMessage = async (imgURL = null) => {
    if (!chatData || !chatData.chatId) {
      console.error("Chat ID is missing.");
      return;
    }

    const newMessage = {
      id: uuid(),
      text,
      senderId: currentUser.uid,
      date: Timestamp.now(),
      ...(imgURL && { img: imgURL }),
    };

    try {
      await updateDoc(doc(db, "chats", chatData.chatId), {
        messages: arrayUnion(newMessage),
      });

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [`${chatData.chatId}.lastMessage`]: { text },
        [`${chatData.chatId}.date`]: serverTimestamp(),
      });
      await updateDoc(doc(db, "userChats", chatData.user?.uid), {
        [`${chatData.chatId}.lastMessage`]: { text },
        [`${chatData.chatId}.date`]: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const press = (e) => {
    e.code === "Enter" && handleSend();
  };
  return (
    <div className=" ">
      <div>
        <div className="flex items-center rounded-full bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600 ">
          {emojiData ? (
            <div className="absolute bottom-[39px]">
              <Picker data={data} onEmojiSelect={addEmoji} />
            </div>
          ) : null}
          <div
            onClick={() => {
              img ? setEmojiData(false) : setEmojiData(!emojiData);
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
              />
            </svg>
          </div>
          <input
            type="text"
            readOnly={img !== null}
            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
            placeholder="Message"
            onChange={(e) => setText(e.target.value)}
            value={text}
            onKeyDown={press}
            ref={inputRef}
          />
          <div className="flex gap-2 mr-2 items-center">
            <span>{img ? img?.name : null}</span>
            {img ? (
              <img
                src="cross.jpeg"
                className="w-7 h-5 flex items-center justify-center rounded-full bg-cyan-600 text-white cursor-pointer"
                onClick={() => setImg(null)}
              />
            ) : null}
            <input
              className="w-20"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="imageFile"
              onChange={(e) => {
                setText("");
                setImg(e.target.files[0]);
              }}
            />
            <label htmlFor="imageFile">
              {img ? null : (
                <img src={"gallery.png"} alt="" className="w-6 h-6" />
              )}
            </label>
            <input
              className="w-20"
              type="file"
              style={{ display: "none" }}
              id="file"
              onChange={(e) => setImg(e.target.files[0])}
            />
            <label htmlFor="">
              {img ? null : (
                <img src={"attach.png"} alt="" className="w-6 h-6" />
              )}
            </label>
          </div>
          <div
            className="bg-[oklch(0.76_0.06_250.37)] p-2 text-white  rounded-full h-10 w-10 flex justify-center items-center cursor-pointer"
            onClick={handleSend}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                className="cursor-pointer"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMsg;

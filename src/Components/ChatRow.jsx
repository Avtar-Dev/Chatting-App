import React, { useEffect, useState } from "react";

const ChatRow = ({ dp, name, msg, chat, userMsg }) => {
  const [time, setTime] = useState("No Time");

  const formatFirestoreTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "Invalid Time";

    const date = new Date(timestamp.seconds * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  useEffect(() => {
    if (chat?.date) {
      setTime(formatFirestoreTimestamp(chat.date));
    }
  }, [msg]);

  const notUpload = "not-upload.png";
  const message = userMsg ? userMsg : msg;
  const maxLength = 25;
  const textLength =
    message.length > maxLength
      ? message.substring(0, maxLength) + "..."
      : message;

  return (
    <div className="w-auto bg-amber-100">
      <div className=" w-auto h-[11vh] flex items-center border-b-[0.1px] border-[rgb(214,230,255)] cursor-pointer ml-4 mr-4">
        <img
          src={dp == "" ? notUpload : dp}
          alt=""
          className="w-13 h-13 rounded-full object-cover "
        />

        <div className="ml-2">
          <div className="">
            <b>{name}</b>
            <div className="">{textLength}</div>
          </div>
        </div>

        <div className="self-center ml-auto text-sm font-medium min-w-max flex">
          {time}
        </div>
      </div>
    </div>
  );
};

export default ChatRow;

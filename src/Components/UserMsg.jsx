import React, { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../../Context/ChatContext";

const UserMsg = ({ message }) => {
  const { data } = useContext(ChatContext);
  const ref = useRef();

  const isUserMessage = message.senderId !== data.currentUserId;

  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    const date = timestamp.toDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <>
      {isUserMessage && (
        <>
          <div
            ref={ref}
            className="mr-auto mb-3"
            style={{ maxWidth: "-webkit-fill-available" }}>
            {message.text == "" ? null : (
              <div
                className={`w-max ${
                  message.text ? "border border-[#dba2a2]" : ""
                } p-4 rounded-xl  ml-1 break-words mr-1`}
                style={{ maxWidth: "-webkit-fill-available" }}>
                {message.text}
              </div>
            )}
            {message.img && (
              <div className="ml-2">
                <img
                  src={message.img}
                  alt="Uploaded"
                  className="rounded-xl h-56"
                />
              </div>
            )}
            <div className="text-[10px] flex justify-start ml-3">
              {formatDate(message.date)}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserMsg;

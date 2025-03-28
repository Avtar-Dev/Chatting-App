import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../Context/AuthContext";

const MyMsg = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const ref = useRef();
  const isMyMessage = message.senderId === currentUser.uid;

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
      {isMyMessage && (
        <div
          ref={ref}
          className="ml-auto mb-3 "
          style={{ maxWidth: "-webkit-fill-available" }}>
          <div
            className={`w-max p-4 rounded-xl ml-1 break-words mr-1 ${
              message.text ? "border border-[#dba2a2]" : "" // 🔹 Only apply border if text exists
            }`}
            style={{ maxWidth: "-webkit-fill-available" }}>
            {message.text}
          </div>
          {message.img && (
            <div className="mr-2">
              <img
                src={message.img}
                alt="Uploaded"
                className="rounded-xl h-56"
              />
            </div>
          )}
          <div className="text-[10px] flex justify-end mr-3">
            {formatDate(message.date)}
          </div>
        </div>
      )}
    </>
  );
};

export default MyMsg;

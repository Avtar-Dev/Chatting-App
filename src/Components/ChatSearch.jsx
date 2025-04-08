import React from "react";

const ChatSearch = ({ user, handleSelect }) => {
  const notUpload = "not-upload.png";
  return (
    <div
      className="w-auto bg-amber-100 h-[11vh] flex items-center border-b-[0.1px] border-[rgb(214,230,255)] cursor-pointer ml-4 mr-4"
      onClick={() => handleSelect(user)}>
      <div className="flex items-center">
        <img
          src={user?.photoURL == "" ? notUpload : user?.photoURL}
          alt="User"
          className="w-13 h-13 rounded-full object-cover"
        />
        <div className="ml-2">
          <b>{user?.displayName}</b>
        </div>
      </div>
    </div>
  );
};

export default ChatSearch;

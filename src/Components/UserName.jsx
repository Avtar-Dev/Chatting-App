import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../Context/ChatContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Context/FirebaseContext";

const UserName = () => {
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!data?.user?.uid) return;

      try {
        const ref = doc(db, "users", data.user.uid);
        const snap = await getDoc(ref);
        const value = snap?.data();
        setStatus(value?.online);
        console.log("Fetched data:", value);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [data?.user?.uid]);

  const userPhoto = data.user?.photoURL || "https://via.placeholder.com/40";
  const userName = data.user?.displayName || "No user selected";

  return (
    <div className="bg-cyan-500 h-[8vh] flex items-center border-b-[0.1px] border-cyan-500 sticky w-full top-0">
      <span
        className="ml-4 cursor-pointer"
        onClick={() => navigate("/chatlist")}>
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
            d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
          />
        </svg>
      </span>

      <img
        src={userPhoto}
        alt="User Profile"
        className="w-10 h-10 rounded-full ml-4"
      />

      <div className="ml-2">
        <div>
          <b>{userName}</b>
        </div>
        <p className="text-sm">{status ? "Online" : "Offline"}</p>
      </div>
    </div>
  );
};

export default UserName;

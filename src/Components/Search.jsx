import React from "react";
import { db } from "../../Context/FirebaseContext";
import { collection, getDocs, query, where } from "firebase/firestore";
const Search = ({ setUser, setErr, setUserName, UserName }) => {
  //we will store search name in user

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", UserName)
    );
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length > 0) {
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
          setErr(false);
        });
      } else {
        setErr(true);
      }
    } catch (err) {
      console.log("UserName", err);
    }
  };

  const handleKey = async (e) => {
    e.code === "Enter" && handleSearch();
  };

  return (
    <div className="bg-amber-100 flex justify-center m-8">
      <div className="flex items-center pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600 bg-amber-100 rounded-xl w-2xl">
        <input
          type="text"
          name="price"
          id="price"
          className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 bg-amber-100"
          placeholder="Search"
          onKeyDown={handleKey}
          onChange={(e) => {
            setUserName(e.target.value);
            setErr(false);
          }}
          value={UserName}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6 bg-amber-100 mr-1"
          onClick={() => handleSearch()}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default Search;

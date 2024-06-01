import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

import toast from "react-hot-toast";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import UserCard from "./UserCard";

const SearchUser = ({ onClose }) => {
  //for displaying all the users in UserCard component
  const [searchUser, setSearchUser] = useState([]);
  //for loading the content
  const [loading, setLoading] = useState(false);
  //when everytime the api calls we need to store the data in one state 
  const [searchInput, setSearchInput] = useState("");

  const handleSearchUser = async () => {
    const url = import.meta.env.VITE_API_URL;
    try {
      //when the api was called setLoading will be true 
      //before calling this api setLoading will be true
      setLoading(true);
      const response = await axios.post(`${url}/search`, {
        search: searchInput,
      });
      //when loading was done this setLoading need to be false after calling the post ap
      setLoading(false);
      // Returning the response
      setSearchUser(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    handleSearchUser();
  }, [searchInput]);
  //when i was trying to find the user this searchInput should work and handleSearchUser() function should call

  console.log("searchUser", searchUser);
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10 ">
      <div className="w-full max-w-lg mx-auto mt-10">
        {/**input search user */}
        <div className="bg-white rounded h-14 overflow-hidden flex ">
          <input
            type="text"
            placeholder="Search user by name, email...."
            className="w-full outline-none py-1 h-full px-4"
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          />
          <div className="h-14 w-14 flex justify-center items-center">
            <IoSearchOutline size={25} />
          </div>
        </div>

        {/**display search user */}
        <div className="bg-white mt-2 w-full p-4 rounded">
          {/**no user found */}
          {searchUser.length === 0 && !loading && (
            <p className="text-center text-slate-500">no user found!</p>
          )}

          {loading && (
            <div role="status" className="flex justify-center">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}

          {/* displaying the user if available */}
          {searchUser.length !== 0 &&
            !loading &&
            searchUser.map((user, index) => {
              return <UserCard key={user._id} user={user} onClose={onClose} />;
            })}
        </div>
      </div>

      <div
        className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white"
        onClick={onClose}
      >
        <button>
          <IoClose />
        </button>
      </div>
    </div>
  );
};

export default SearchUser;

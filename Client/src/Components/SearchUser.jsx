import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import UserCard from "./UserCard";

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const handleSearchUser = async () => {
    setLoading(true);
    try {
      const url = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${url}/search`, {
        search: searchInput,
      });
      setSearchUser(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleSearchUser();
  }, [searchInput]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10 ">
      <div className="w-full max-w-lg mx-auto mt-10">
        <div className="bg-white rounded h-14 overflow-hidden flex">
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

        <div className="bg-white mt-2 w-full p-4 rounded">
          {searchUser.length === 0 && !loading && (
            <p className="text-center text-slate-500">No user found!</p>
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
                {/* SVG for loading spinner */}
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}

          {searchUser.length !== 0 && !loading && (
            <div className="max-h-60 overflow-y-auto">
              {/* Set max height and enable scrolling */}
              {searchUser.map((user) => (
                <UserCard key={user._id} user={user} onClose={onClose} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white"
        onClick={onClose}
      >
        <IoClose />
      </div>
    </div>
  );
};

export default SearchUser;

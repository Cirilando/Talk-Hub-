import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";


const Email = () => {
  const [loginData, setLoginData] = useState({ email: "" });
  const history = useNavigate();

  const handleClick = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    const url = import.meta.env.VITE_API_URL;

    e.preventDefault();
    try {
      const response = await axios.post(`${url}/email`, loginData);
      if (response.status === 200) {
        localStorage.setItem("emailId", response.data.data.email);
        localStorage.setItem("name", response.data.data.name);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        setLoginData({ email: "" });
        history("/password");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="w-full flex justify-center mt-10">
        <div className="bg-gray-100 w-11/12 max-w-md p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <p className="text-xl font-bold">Sign in</p>
            <p>Sign in to continue to Talk Hub</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="relative mb-6">
              <label htmlFor="username" className="block mb-2">Email</label>
              <div className="flex items-center">
                <FaUser className="absolute left-2 h-6 mt-1" />
                <input
                  className="w-full border rounded-xl pl-8 py-2"
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleClick}
                />
              </div>
            </div>
            <button
              className="w-full py-2 bg-indigo-700 text-white font-semibold rounded-xl transition duration-300 hover:bg-indigo-600"
            >
              Let's Go
            </button>
          </form>
        </div>
      </div>
      <p className="mt-8 text-center text-gray-600">&copy; Talk Hub All rights reserved.</p>
    </>
  );
};

export default Email;

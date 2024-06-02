import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FaLock } from "react-icons/fa";
import Avatar from "../Components/Icon";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setToken } from "../Redux/userSlice";

const Password = () => {
  const [passwordData, setPasswordData] = useState({ password: "" });
  const history = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    } else if (location.state && location.state.userName) {
      setUserName(location.state.userName);
    }
  }, [location.state]);

  const handleClick = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailId = localStorage.getItem("emailId");
    const url = import.meta.env.VITE_API_URL;
  
    try {
      const datas = {
        email: emailId,
        password: passwordData.password,
      };
  
      const response = await axios.post(`${url}/login`, datas, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (response.status === 200) {
        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          dispatch(setToken(response.data.token));
          toast.success(response.data.message);
          setPasswordData({ password: "" });
          history("/home");
        } else {
          toast.error(response.data.message);
        }
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };
  

  return (
    <>
      <div className="w-full flex justify-center mt-10">
        <div className="bg-gray-100 w-11/12 max-w-md p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <Avatar
              width={50}
              height={40}
              name={userName} // Use the userName state
              imageUrl={location?.state?.profilePic}
            />
            <p className="font-semibold text-lg">{userName}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <label htmlFor="password" className="block mb-2">Password</label>
              <div className="flex items-center">
                <FaLock className="absolute left-2 mt-1 h-6" />
                <input
                  className="w-full border rounded-xl pl-8 py-2"
                  type="password"
                  name="password"
                  value={passwordData.password}
                  onChange={handleClick}
                />
              </div>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
              />
              <label className="ml-2 text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <button className="w-full py-2 bg-indigo-700 text-white font-semibold rounded-xl transition duration-300 hover:bg-indigo-600">
              Sign In
            </button>
          </form>
        </div>
      </div>
      <div className="mt-8 text-center">
        <p className="text-lg">
          Don't have an account?
          <Link to="/" className="text-indigo-600 ml-2">
            Sign Up Now
          </Link>
        </p>
      </div>
      <p className="mt-8 text-center text-gray-600">&copy; Talk Hub All rights reserved.</p>
    </>
  );
};

export default Password;

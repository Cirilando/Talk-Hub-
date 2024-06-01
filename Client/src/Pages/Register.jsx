import React, { useState, useRef } from "react";
import { FaLock, FaMailBulk, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { IoIosClose } from "react-icons/io";


const Register = () => {
  const initialData = {
    name: "",
    password: "",
    email: "",
    profilePic: null,
  };

  const [regData, setRegData] = useState(initialData);
  const history = useNavigate();
  const fileInputRef = useRef(null);

  const handleClick = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
      setRegData((prev) => ({
        ...prev,
        profilePic: files[0], 
      }));
    } else {
      setRegData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const clearImage = () => {
    setRegData((prev) => ({
      ...prev,
      profilePic: null,
    }));
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    const url = import.meta.env.VITE_API_URL;
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", regData.name);
      formData.append("password", regData.password);
      formData.append("email", regData.email);
      formData.append("profilePic", regData.profilePic); // Append the profile picture file

      const response = await axios.post(
        `${url}/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type to multipart/form-data for file upload
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setRegData({
          name: "",
          password: "",
          email: "",
          profilePic: null,
        });
        history("/email");
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
        <div className="bg-gray-100 w-10/12 max-w-md p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <p className="text-xl font-bold">Registration</p>
            <p className="text-gray-700">Get Your Talk Hub account now.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <label htmlFor="email" className="block mb-2">Email</label>
              <div className="flex items-center">
                <FaMailBulk className="absolute left-2 mt-1 h-6" />
                <input
                  className="w-full border rounded-xl pl-8 py-2"
                  type="email"
                  name="email"
                  id="email"
                  value={regData.email}
                  onChange={handleClick}
                />
              </div>
            </div>
            <div className="relative mb-4">
              <label htmlFor="name" className="block mb-2">Name</label>
              <div className="flex items-center">
                <FaUser className="absolute left-2 mt-1 h-6" />
                <input
                  className="w-full border rounded-xl pl-8 py-2"
                  type="text"
                  id="name"
                  name="name"
                  value={regData.name}
                  onChange={handleClick}
                />
              </div>
            </div>
            <div className="relative mb-4">
              <label htmlFor="password" className="block mb-2">Password</label>
              <div className="flex items-center">
                <FaLock className="absolute left-2 mt-1 h-6" />
                <input
                  className="w-full border rounded-xl pl-8 py-2"
                  type="password"
                  id="password"
                  name="password"
                  value={regData.password}
                  onChange={handleClick}
                />
              </div>
            </div>
            <div className="relative mb-4">
              <label htmlFor="profilePic" className="block mb-2">Profile Picture</label>
              <div className="relative">
                <div className="rounded-xl bg-white flex justify-center items-center border hover:border-blue-500 cursor-pointer py-2">
                  <p className="text-sm" onClick={handleUploadClick}>
                    {regData.profilePic?.name ? regData.profilePic?.name : "Upload Profile Photo"}
                  </p>
                  {regData.profilePic?.name && (
                    <button
                      type="button"
                      className="text-lg ml-2"
                      onClick={clearImage}
                    >
                      <IoIosClose />
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  id="profilePic"
                  name="profilePic"
                  className="hidden"
                  onChange={handleClick}
                  ref={fileInputRef}
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
              Register
            </button>
          </form>
        </div>
      </div>
      <div className="mt-8 text-center">
        <p className="text-lg">
          Already have an account?
          <Link to="/email" className="text-indigo-600 ml-2">
            Sign In
          </Link>
        </p>
      </div>
      <p className=" text-center text-gray-600">&copy; Talk Hub All rights reserved.</p>
    </>
  );
};

export default Register;

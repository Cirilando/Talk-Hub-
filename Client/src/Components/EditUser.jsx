import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Icon";
import axiosInstance from "../Interceptors/Interceptor";
import toast from "react-hot-toast";

const EditUser = ({ onClose, data }) => {
  const [editData, setEditData] = useState({
    name: data?.user,
    profilePic: data?.profilePic,
    email : data?.email
  });

  useEffect(() => {
    setEditData((prev) => ({
      ...prev,
      ...data,
    }));
  }, [data]);

  const uploadPhoto = useRef();
  
  const handleUploadPhoto = () => {
    uploadPhoto.current.click();
  };

  const handleClick = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
      setEditData((prev) => ({
        ...prev,
        profilePic: files[0], 
      }));
    } else {
      setEditData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
  
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("profilePic", editData.profilePic);
      formData.append("email",editData.email)
  
      const response = await axiosInstance.put('/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success(response.data.message);
      onClose()
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-4 m-4 sm:m-6 rounded-xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        <h2 className="font-semibold text-lg md:text-xl">Profile Details</h2>
        <p className="text-sm md:text-base">Edit User Details</p>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm md:text-base">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={editData.name}
              onChange={handleClick}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></input>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm md:text-base">Email:</label>
            <input
              type="text"
              name="email"
              id="email"
              value={editData.email}
              onChange={handleClick}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></input>
          </div>
          <div className="mt-4">
            <p className="text-sm md:text-base">Photo:</p>
            <div className="flex items-center gap-5 mt-2">
              <Avatar
                width={40}
                height={40}
                imageUrl={data?.profilePic}
                name={data?.name}
                className="w-10 h-10 md:w-12 md:h-12"
              />
              <label htmlFor="profilePic">
                <button
                  type="button"
                  className="font-semibold text-blue-500 hover:underline"
                  onClick={handleUploadPhoto}
                >
                  Change Photo
                </button>
                <input
                  type="file"
                  className="hidden"
                  id="profilePic"
                  name="profilePic"
                  onChange={handleClick}
                  ref={uploadPhoto}
                />
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="text-blue-500 bg-transparent px-4 py-2 rounded-xl font-semibold hover:bg-blue-500 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-blue-500 bg-transparent px-4 py-2 rounded-xl font-semibold hover:bg-blue-500 hover:text-white transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EditUser);

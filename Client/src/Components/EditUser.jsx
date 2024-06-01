import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Icon";
import axiosInstance from "../Interceptors/Interceptor"
import toast from "react-hot-toast";

const EditUser = ({ onClose, data }) => {
  const [editData, setEditData] = useState({
    name: data?.user,
    profilePic: data?.profilePic,
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
  
      const response = await axiosInstance.put('/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success(response.data.message);
      // onClose()
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // const clearImage = () => {
  //   setEditData((prev) => ({
  //     ...prev,
  //     profilePic: null,
  //   }));
  // };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white md:p-4 md:m-1 rounded-xl w-full max-w-sm">
        <h2 className="font-semibold">Profile Details</h2>
        <p className="text-sm">Edit User Details</p>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name : </label>
            <input
              type="text"
              name="name"
              id="name"
              value={editData.name}
              onChange={handleClick}
              className="w-full md:px-1 md:py-1 focus:outline-"
            ></input>
          </div>
          <div>
            <p>Photo : </p>
            <div className="flex items-center gap-5">
              <Avatar
                width={40}
                height={40}
                imageUrl={data?.profilePic}
                name={data?.name}
                className="md:px-1 md:py-1"
              />
              <label htmlFor="profilePic">
                <button
                  type="button"
                  className="font-semibold md:px-1 md:py-1"
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
          <div className="flex gap-2 w-fit ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="border border-blue-700 text-blue-500 md:px-4 md:py-1 md:mt-4 rounded-xl font-semibold hover:bg-indigo-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="border border-blue-700 text-blue-500 md:px-4 md:py-1 md:mt-4 rounded-xl font-semibold hover:bg-indigo-800 hover:text-white"
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

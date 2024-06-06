import React, { useState, useEffect } from "react";
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from "react-redux";

const Avatar = ({ userId, name, width, height }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);
  // const [imageUrl, setImageUrl] = useState(null);

  // useEffect(() => {
  //   // Fetch image URL from backend
  //   fetch("/pic") // Assuming this endpoint serves the profile picture for the user
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.blob();
  //     })
  //     .then((blob) => {
  //       const imageUrl = URL.createObjectURL(blob);
  //       setImageUrl(imageUrl);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching image:", error);
  //     });
  // }, []);

  // Fetch name from local storage
  const ciril = localStorage.getItem("name");

  // Use the name from props or ciril
  const displayName = name || ciril;

  let avatarName = "";

  if (displayName) {
    const splitName = displayName.split(" ");

    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
  }

  const bgColor = [
    "bg-slate-200",
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-gray-200",
    "bg-cyan-200",
    "bg-sky-200",
    "bg-blue-200",
  ];

  const randomNumber = Math.floor(Math.random() * 9);

  const isOnline = onlineUser.includes(userId);

  return (
    <div
      className={`text-slate-800 rounded-full font-bold relative`}
      style={{ width: width + "px", height: height + "px" }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          width={width}
          height={height}
          alt={displayName}
          className="overflow-hidden rounded-full"
        />
      ) : displayName ? (
        <div
          style={{ width: width + "px", height: height + "px" }}
          className={`overflow-hidden rounded-full flex justify-center items-center text-lg ${bgColor[randomNumber]}`}
        >
          {avatarName}
        </div>
      ) : (
        <PiUserCircle size={width} />
      )}

      {isOnline && (
        <div className="bg-green-600 p-1 absolute bottom-2 -right-1 z-10 rounded-full"></div>
      )}
    </div>
  );
};

export default Avatar;

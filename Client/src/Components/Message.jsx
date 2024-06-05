import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Icon";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaImage, FaPlus, FaVideo } from "react-icons/fa";
import uploadFiles from "../Helpers/uploadFile";
import { IoClose } from "react-icons/io5";
import background from "../assets/wallpaper.jpeg";
import { IoMdSend } from "react-icons/io";
import moment from "moment";
const Message = () => {
  const params = useParams();
  // console.log("parms",params.userId);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);

  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profilePic: "",
    online: false,
    _id: "",
  });
  const [uploadImageVideo, setuploadImageVideo] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    video: "",
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);
  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);
      socketConnection.emit('seen', params.userId)
      socketConnection.on("messageuser", (data) => {
        setDataUser(data);
        // console.log("userdata",data)
      });
      socketConnection.on("message", (data) => {
        console.log("message data", data);
        setAllMessage(data);
      });

    }
  }, [socketConnection, params?.userId, user]);

  const handleImageVideo = () => {
    setuploadImageVideo((prev) => !prev);
  };
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFiles(file);
    // when the uploading is done i need to close that particular action
    setLoading(false);
    setuploadImageVideo(false);
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: uploadPhoto.url,
      };
    });
  };
  const clearImage = () => {
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: "",
      };
    });
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFiles(file);
    setLoading(false);
    setuploadImageVideo(false);
    setMessage((prev) => {
      return {
        ...prev,
        video: uploadPhoto.url,
      };
    });
  };
  const clearVideo = () => {
    setMessage((prev) => {
      return {
        ...prev,
        video: "",
      };
    });
  };
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setMessage((prev) => {
      return {
        ...prev,
        text: value,
      };
    });
  };

  const handleOnSubmitMessage = (e) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.video) {
      if (socketConnection) {
        // sending data from the frontend side  and also all these data have to accepted to the backend
        socketConnection.emit("new message", {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          video: message.video,
          msgByUserId: user?._id,
        });
        setMessage({
          text: "",
          imageUrl: "",
          video: "",
        });
      }
    }
  };
  return (
    <div
      style={{ background: `url(${background})` }}
      className="bg-no-repeat bg-cover object-cover w-full opacity-90"
    >
      <header className="sticky top-0 h-16 bg-gray-200  flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link to="/home" className="md:hidden">
            <FaAngleLeft size={25}  />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h1 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h1>
            <p className="-my-2 text-sm">
              {dataUser.online ? (
                <span className="text-blue-700">Online</span>
              ) : (
                <span className="text-red-700">Offline</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <button className="cursor-pointer hover:text-blue-800">
            <HiDotsVertical />
          </button>
        </div>
      </header>
      
      {/* showing all the messages */}

      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative ">
        {/* showing the uploaded image */}

        <div className="flex flex-col gap-3 py-2 mx-1" ref={currentMessage}>
          {allMessage &&
            allMessage.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  user._id === msg.msgByUserId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    user._id === msg.msgByUserId
                      ? "bg-blue-600 "
                      : "bg-green-600 "
                  } text-white p-1 py-1 mt-1 rounded-xl max-w-[70%] ${
                    user._id === msg.msgByUserId ? "mr-2" : "ml-2"
                  }`}
                >
                  <div className="w-full">
                    {msg?.imageUrl && (
                      <img
                        src={msg?.imageUrl}
                        className="w-96 h-full object-scale-down"
                      />
                    )}

                    {msg?.video && (
                      <video
                        src={msg?.video}
                        className="w-96 h-full object-scale-down"
                        controls
                      />
                    )}
                  </div>
                  <p className="px-1">{msg.text}</p>
                  <p className="text-xs text-right">
                    {moment(msg.createdAt).format("hh:mm")}
                  </p>
                </div>
              </div>
            ))}
        </div>
        {message.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-200 flex items-center justify-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={clearImage}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message.imageUrl}
                alt="image"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}
        {/* showing the uploaded video */}
        {message.video && (
          <div className="w-full h-full sticky bottom-0 bg-slate-200 flex items-center justify-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={clearVideo}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message.video}
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              >
                {" "}
              </video>
            </div>
          </div>
        )}
        {loading && (
          <div
            role="status"
            className=" inset-0 flex justify-center  sticky  items-center "
          >
            <svg
              aria-hidden="true"
              className="w-8 h-8 animate-spin dark:text-gray-600 fill-blue-600"
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
      </section>

      <section className="h-16 flex items-center px-2 bg-white">
        <div className=" relative ">
          <button
            onClick={handleImageVideo}
            className="flex justify-center items-center w-11 h-11 rounded-full hover:bg-blue-600 hover:text-white"
          >
            {" "}
            <FaPlus size={20} />
          </button>
          {/* video and image upload  */}
          {uploadImageVideo && (
            <div className="shadow rounded absolute bottom-14 w-36  p-2 px-3">
              <form>
                <label
                  htmlFor="uploadimage"
                  className="flex items-center p-2 gap-3 hover:bg-gray-200 cursor-pointer"
                >
                  <div className="text-blue-800 ">
                    <FaImage size={20} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadvideo"
                  className="flex items-center p-2 gap-3 hover:bg-gray-200 cursor-pointer"
                >
                  <div className="text-purple-800">
                    <FaVideo size={20} />
                  </div>
                  <p>Video</p>
                </label>
                <input
                  type="file"
                  id="uploadimage"
                  onChange={handleUploadImage}
                  className="hidden"
                />
                <input
                  type="file"
                  id="uploadvideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>
        {/* input box */}
        <form
          className="h-full w-full flex gap-2 "
          onSubmit={handleOnSubmitMessage}
        >
          <input
            type="text"
            placeholder="Enter Your Message"
            className="py-1 px-4 outline-none w-full h-full"
            value={message.text}
            onChange={handleOnChange}
          />
          <button className="text-blue-600">
            <IoMdSend size={30} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default Message;

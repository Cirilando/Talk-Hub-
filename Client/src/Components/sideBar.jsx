import React, { useEffect, useState } from "react";
import { CgLogOut } from "react-icons/cg";
import { FaRocketchat, FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import Avatar from "../Components/Icon";
import { useDispatch, useSelector } from "react-redux";
import EditUser from "./EditUser";
import { FaImage, FaVideo } from "react-icons/fa";
// import Message from "./Message";

import { GoArrowUpLeft } from "react-icons/go";
import SearchUser from "./SearchUser";
import { logOut } from "../Redux/userSlice";
const SideBar = () => {
  const user = useSelector((state) => state?.user);
  const [editUser, setEditUser] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openUser, setOpenUser] = useState(false);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);
      socketConnection.on("conversation", (data) => {
        // console.log("datas", data);
        const conversationUserData = data.map((conversationUser, index) => {
          if (conversationUser.sender?._id === conversationUser.receiver?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          } else if (conversationUser.receiver?._id !== user._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        });
        setAllUser(conversationUserData); // Update state with conversationUserData
      });
    }
  }, [socketConnection, user]); // Ensure user._id is properly specified as a dependency
const handleLogOut = ()=>{
  dispatch(logOut())
  navigate("/email")
  localStorage.clear()

}
  return (
    <>
      <div className="md:w-full md:h-screen grid grid-cols-[48px,1fr] ">
        <div className="w-12 h-full rounded-tr-xl rounded-br-xl  flex flex-col justify-between ">
          <div>
            <NavLink
              className={({ isActive }) =>
                `w-12 h-12 flex  justify-center items-center cursor-pointer ${
                  isActive && "bg-slate-300"
                }`
              }
            >
              <FaRocketchat size={30} title="Chat" />
            </NavLink>
            <div
              onClick={() => setOpenUser(true)}
              className="w-12 h-12 flex  justify-center items-center cursor-pointer"
            >
              <FaUserPlus size={30} title="Add Friend" />
            </div>  
          </div>
          <div className="flex flex-col items-center">
            <button
              className="mx-auto"
              title={user?.name}
              onClick={() => setEditUser(true)}
            >
              <Avatar
                width={40}
                height={40}
                name={user?.name}
                userId={user?._id}
                imageUrl={user?.imageUrl}
              />
            </button>
            <button className="w-12 h-12 flex  justify-center items-center cursor-pointer" onClick={handleLogOut}>
              <span>
                {" "}
                <CgLogOut size={30} title="Log Out" />
              </span>
            </button>
          </div>
        </div>
        <div className=" w-full">
          <div className="flex items-center h-14">
            {" "}
            <h1 className="text-lg md:text-xl font-bold  p-3 md:py-4">
             Recent Messages
            </h1>
          </div>
          <div className=" h-[calc(100vh-140px)] overflow-x-hidden overflow-y-scroll scrollbar">
            {allUser.length === 0 && (
              <div className="md:mt-28">
                <div className="flex justify-center items-center my-5 ">
                  <GoArrowUpLeft size={50} />
                </div>
                <p className="text-lg text-center">
                  Explore users to start the conversation{" "}
                </p>
              </div>
            )}
            {/* listing all the users in ths side bar  */}
            {allUser.map((conv, index) => {
              return (
                <NavLink to ={"/home/"+conv?.userDetails?._id}
                  key={conv?._id}
                  className="flex items-center gap-2 px-2  py-3 border border-transparent hover:border-blue-500 rounded-xl hover:bg-gray-100 cursor-pointer"
                >
                  <div>
                    <Avatar
                      imageUrl={conv?.userDetails?.profilePic}
                      name={conv?.userDetails?.name}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div>
                    <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">
                      {conv?.userDetails?.name}
                    </h3>
                    <div className="text-sm  flex items-center gap-1">
                      {/* last message of the particular user */}
                      <div className="">
                        {conv?.lastMsg?.imageUrl && (
                          <div className="flex items-center gap-1">
                            <span className="text-blue-800">
                              <FaImage />
                            </span>
                            {!conv?.lastMsg?.text && <span>Image</span>}
                          </div>
                        )}
                        {conv?.lastMsg?.video && (
                          <div className="flex items-center gap-1">
                            <span className="text-violet-800">
                              <FaVideo />
                            </span>
                            {!conv?.lastMsg?.text && <span>Video</span>}
                          </div>
                        )}
                      </div>
                      <p className="text-ellipsis line-clamp-1">{conv?.lastMsg?.text}</p>
                    </div>
                  </div>
                  {/* No of unseen messages  */}
                  {
                  Boolean( conv?.unSeenMessage) && (
                      <p className="text-xs w-6 h-6 flex items-center justify-center  ml-auto p-1 text-white bg-blue-500 font-semibold rounded-full">
                      {conv?.unSeenMessage}
                    </p>

                    )
                  }

                
                </NavLink>
              );
            })}
          </div>
        </div>

        {/**edit user */}
        {editUser && (
          <EditUser onClose={() => setEditUser(false)} data={user} />
        )}
        {/* search Users */}
        {openUser && <SearchUser onClose={() => setOpenUser(false)} />}
      </div>
    </>
  );
};

export default SideBar;

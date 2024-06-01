import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { logOut, setOnlineUser, setSocketConnection, setToken, setUser } from "../Redux/userSlice";
import SideBar from "../Components/sideBar";
import logo from "../assets/logo.png";
import { io } from 'socket.io-client';

const Home = () => {
  const redux = useSelector((state) => state.user);
  console.log("redux", redux);
  const dispatch = useDispatch();
  const history = useNavigate();
  const location = useLocation();

  const fetchUserDetails = async () => {
    try {
      const url = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(`${url}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     
      dispatch(setUser(response.data.data));
      dispatch(setToken(token));
      if (response.data.logout) {
        dispatch(logOut());
        history("/email");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    // Establish socket connection
    const token = localStorage.getItem("token");
    if (token) {
      const socketConnection = io(import.meta.env.VITE_API_URL, {
        withCredentials: true,
        auth: {
          token: token,
        },
      });
      console.log("Socket connected");

      socketConnection.on("user online", (data) => {
        console.log("online users",data);
        dispatch(setOnlineUser(data))
      });
      dispatch(setSocketConnection(socketConnection))
      return () => {
        socketConnection.disconnect();
        console.log("Socket disconnected");
      };
    } else {
      console.log("No token found");
    }
  }, []);

  const basePath = location.pathname === "/home";
  return (
    <div className="grid md:grid-cols-[300px,1fr] md:h-[697px] max-h-screen">
      <section className={`${!basePath && "hidden"} md:block`}>
        <SideBar />
      </section>
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>
      <div>
        <div
          className={`md:ml-[310px] md:mt-[200px] flex-col gap-3 hidden ${
            !basePath ? "hidden" : "md:flex"
          }`}
        >
          <div className="flex items-center">
            <img src={logo} width={150} alt="logo" />
            <p className="font-bold font-serif md:text-3xl">Talk Hub</p>
          </div>
          <p className="md:ml-16"> Select User To Send Message</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

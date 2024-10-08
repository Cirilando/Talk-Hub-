const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
const router = require("./Routes/router");
const Connect = require("./common/connection")
// const { messageModel, conversationModel } = require("./Models/conversationModels")
const {app,socketConnection} = require("./Socket/socketio")
// const app = express();
dotenv.config();
app.use(express.json());
app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin);
  next();
});
const allowedOrigin = ['https://talkhubchatapplication.netlify.app', 'http://localhost:5173', 'http://localhost:5175'];
app.use(cookieParser())
app.use(cors({
  origin: allowedOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));
Connect();
app.use(router);
const port = 8088;
app.get("/", (req, res) => {
  res.json({
    message: "Server is Running on",
  });
});
socketConnection.listen(port, () => {
  console.log("My Port Number is ", port); 
});

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
const allowedOrigin = 'http://localhost:5173';
app.use(cookieParser())
app.use(cors({
  origin: allowedOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));
Connect();
app.use(router);
const port = 8080;
app.get("/", (req, res) => {
  res.json({
    message: "Server is Running on",
  });
});
socketConnection.listen(port, () => {
  console.log("My Port Number is ", port); 
});

const express = require("express");
const getConversation = require("../Helpers/getConversation");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const getUserDetailsFromToken = require("../Helpers/userDetails");
const UserModel = require("../Models/userModels");

const Conversation = require("../Models/conversationModels");
const Message = require("../Models/messageModels");
const app = express();
app.use(cors());

const socketConnection = http.createServer(app);
const io = new Server(socketConnection, {
  cors: {
    origin: "https://talkhubchatapplication.netlify.app/",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

//for showing online or not
const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("User Connected : ", socket.id);

  // Retrieve token from handshake data
  const token = socket.handshake.auth.token;

  //current user details
  const user = await getUserDetailsFromToken(token);
  // console.log("user",user);

  //Create an room
  socket.join(user?._id.toString());

  onlineUser.add(user?._id?.toString());
  // console.log( "online",onlineUser);

  //for setting the available users to the client
  // i will get it from the client side in the form of Array
  //"user online" should be matched in our client side
  io.emit("user online", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    console.log("userid to get", userId);
    const userDetails = await UserModel.findById(userId).select("-password");
    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profilePic: userDetails?.profilePic,
      online: onlineUser.has(userId),
    };
    socket.emit("messageuser", payload);

    //get previous message
    const getCoversationMessage = await Conversation.findOne({
      "$or": [
         {
           sender: user?._id,//sender userid
           receiver: userId,//current userId
         },
         {
           sender: userId,
           receiver: user?._id,
         },
       ],
     }).populate('messages').sort({ updatedAt : -1 })
     console.log("get",getCoversationMessage);
     socket.emit('message',getCoversationMessage?.messages || [])
   });
    
  //new message
  socket.on("new message", async (data) => {
    //check the conversation is available for both users
    let conversation = await Conversation.findOne({
      "$or": [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });

    //if conversation is not available
    if (!conversation) {
      const createConversation = new Conversation({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversation = await createConversation.save();
    }

    const message = new Message({
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      msgByUserId: data?.msgByUserId,
    });
    const saveMessage = await message.save();

    await Conversation.updateOne(
      { _id: conversation?._id },
      { "$push": { messages: saveMessage?._id } }
    );

    const getConversationMessage = await Conversation.findOne({
      "$or": [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    }).populate('messages').sort({ updatedAt: -1 });

    io.to(data?.sender).emit('message', getConversationMessage?.messages || []);
    io.to(data?.receiver).emit('message', getConversationMessage?.messages || []);

    //send conversation
    const conversationSender = await getConversation(data?.sender);
    const conversationReceiver = await getConversation(data?.receiver);

    io.to(data?.sender).emit('conversation', conversationSender);
    io.to(data?.receiver).emit('conversation', conversationReceiver);
  });

  //sidebar connection
  socket.on('sidebar', async (currentUserId) => {
    console.log("current user ID:", currentUserId);
    const conversation = await getConversation(currentUserId);
    socket.emit('conversation', conversation);
  });

  socket.on('seen',async (msgByUserId)=>{
    let conversation = await Conversation.findOne({
      "$or": [
        { sender: user?._id, receiver:msgByUserId },
        { sender: msgByUserId, receiver: user?._id },
      ],
    });
    const conversationMessageId = conversation?.messages || []
    const updateMessages = await Message.updateMany(
      {_id : {"$in" : conversationMessageId}, msgByUserId:msgByUserId},
      //whic filed i need to update
      {"$set":{seen : true}}
    )

    const conversationSender = await getConversation(user?._id?.toString());
    const conversationReceiver = await getConversation(msgByUserId);

    io.to(user?._id?.toString()).emit('conversation', conversationSender);
    io.to(msgByUserId).emit('conversation', conversationReceiver);
  })



  socket.on("disconnect", () => {
    onlineUser.delete(user?._id?.toString());
    console.log("User disconnected", socket.id);
  });
});

module.exports = { app, socketConnection };

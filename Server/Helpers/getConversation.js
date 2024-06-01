const Conversation = require("../Models/conversationModels");

const getConversation = async (currentUserId) => {
  if (currentUserId) {
    const currentUserConversation = await Conversation.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .sort({ updatedAt: -1 })
      .populate("messages")
      .populate("sender")
      .populate("receiver");

    console.log("conversations of current user:", currentUserConversation);

    const conversationMessages = currentUserConversation.map((conv) => {
      const countUnSeenMsg = conv.messages.reduce((prev, curr) => {
        const msgByUserId = curr?.msgByUserId?.toString()
        // console.log("id",msgByUserId)
        if (msgByUserId !== currentUserId) {
          return prev + (curr.seen ? 0 : 1);
        }else{
            return prev
        }
      }, 0);
      return {
        _id: conv._id,
        sender: conv.sender,
        receiver: conv.receiver,
        unSeenMessage: countUnSeenMsg,
        lastMsg: conv.messages[conv.messages.length - 1],
      };
    });
    // Sending all the conversations

    return conversationMessages;
  } else {
    return [];
  }
};
module.exports = getConversation;

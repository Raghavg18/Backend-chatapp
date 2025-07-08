import Conversation from "../Models/conversation.model.js";
import Message from "../Models/message.model.js";
import { getRecieversId, io } from "../Socketio/Server.js";

export const sendMessage = async (req, res) => {
    // console.log(req.body)
  try {
    const { messages } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // console.log("step0")
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    console.log(conversation)
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    //   console.log("step1")
    //   console.log(messages)
      const newMessage = new Message({
        sender: senderId,
        receiver: receiverId,
        messages,
      });

    //   conversation.messages = []; 
    //   conversation.messages.push(newMessage._id);
        // console.log(newMessage._id)
      if(newMessage){
        conversation.messages.push(newMessage._id); 
      }
      await Promise.all([conversation.save(), newMessage.save()]);
      const recieversocketId = getRecieversId(receiverId);
      if(recieversocketId){
        io.to(recieversocketId).emit("newMessage", newMessage);
      }
      res.status(200).json({ message: "Message sent successfully", status:true,newMessage });
      return;
    // }

  } catch (error) {
    console.error("Error sending message:" + error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: chatId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, chatId] }
    }).populate("messages");

    if (!conversation) {
      return res.status(404).json([]);
    }

    const message = conversation.messages;
    res.status(200).json({ message });

  } catch (error) {
    console.log("Error getting message:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

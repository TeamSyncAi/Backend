import Chatroom from "../models/Chatroom.js";

export async function createChatroom(req, res) {
  try {
    const newChatroom = await Chatroom.create(req.body);
    res.status(201).json(newChatroom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getChatrooms(req, res) {
  try {
    const chatrooms = await Chatroom.find();
    res.status(200).json(chatrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

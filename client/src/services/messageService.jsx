import API from "./axiosConfig";

export const getConversations = async (query) =>
  await API.get("/messages/chats", { params: query });
export const getMessages = async (user, chatId) =>
  await API.get(`/messages/chat/${chatId}`);
export const sendMessage = async (user, message, recipientId) => {  
  await API.post(`/messages/send/${recipientId}`, message);
}
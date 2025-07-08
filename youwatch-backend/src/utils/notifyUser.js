import { Notification } from "../models/notification.model.js";
import { connectedUsers, io } from "../index.js";

async function notifyUser(receiverUserId, type, message, link = "") {
  if (!receiverUserId) return;

  const notification = new Notification({
    receiverUserId,
    type,
    message,
    link,
  });

  await notification.save();
  const socketId = connectedUsers.get(receiverUserId);
  if (socketId) {
    io.to(socketId).emit("new-notification", notification);
  }
}
// async function deleteNotificatoin(userId,type){
//   const notification = new Notification.findOne({_id: userId,currentUser type})
// }
export default notifyUser;

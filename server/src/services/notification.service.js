import { Notification } from "../model/notification.model.js";

export const createNotification = (payload) => Notification.create(payload);

export const createNotifications = (recipients, payload) => Notification.insertMany(
  recipients.map((recipient) => ({ ...payload, recipient })),
);
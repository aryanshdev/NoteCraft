import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production" ? "https:" : "https://notecraftai-xct5.onrender.com/";

export const socket = io("https://notecraftai-xct5.onrender.com/", {
  autoConnect: false,
  reconnection: true, // default: true
  reconnectionAttempts: Infinity, // try forever
  reconnectionDelay: 1000, // start with 1s delay
  reconnectionDelayMax: 2000, // max delay between attempts
  timeout: 2500, // before connect_error
});

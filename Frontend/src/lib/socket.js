import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production" ? "https:" : "https://notecraftai-xct5.onrender.com";

export const socket = io("https://notecraftai-xct5.onrender.com", {
  autoConnect: false,
});

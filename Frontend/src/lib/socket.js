import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production" ? "https:" : "http://localhost:10000";

export const socket = io("http://localhost:10000", {
  autoConnect: false,
});

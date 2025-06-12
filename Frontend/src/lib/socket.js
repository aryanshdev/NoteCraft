import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production" ? "https:" : "https://notecraftai-xct5.onrender.com/";

export const socket = io("https://notecraftai-xct5.onrender.com/", {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000, // Increased from 2000 to 5000 for better production scenarios
  randomizationFactor: 0.5, // Adds randomness to avoid thundering herd problem
  timeout: 20000, // Increased from 2500 (2.5s is too short for some networks)
  transports: ["websocket", "polling"], // Explicitly specify transport order
});
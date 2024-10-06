import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production" ? undefined : "https://98nhd68r-5656.inc1.devtunnels.ms/";

export const socket = io("https://98nhd68r-5656.inc1.devtunnels.ms/", {
  autoConnect: false,
});

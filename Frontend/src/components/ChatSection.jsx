import { useCallback, useEffect, useState } from "react";
import { socket } from "../lib/socket";
import SystemMSG from "./SystemMSG";
import UserMSG from "./UserMSG";
import { useNavigate, Link } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import AIMSG from "./AIMSG.jsx";

function ChatSection({ id, openFunction }) {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const [name, setName] = useState();
  useEffect(() => {
    fetch("/app/account/getName", {
      method: "GET",
      credentials: "include",
    }).then(async (res) => {
      switch (res.status) {
        case 401:
          setName(null);
          return false;
        case 500:
          navigate("/500");
        case 200:
          let uname = await res.text();
          setName(uname.split(" ")[0]);
          socket.connect();
          socket.emit("createRoom", [id, uname]);
          break;
      }
    });
  }, []);

  useEffect(() => {
    socket.on("SYSTEM", (msg) => {
      setMessages((prevMessages) => [...prevMessages, ["SYSTEM", msg]]);
    });

    socket.on("USER", (msgObject) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        ["USER", msgObject.message, msgObject.name],
      ]);
    });
    socket.on("ServerToUser", (message) => {
      socket.emit("UserToServer", inpEle.value);
      setMessages((prevMessages) => [...prevMessages, ["SELF", inpEle.value]]);
    });

    socket.on("AIQUESTION", (msgObject) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        ["USER", msgObject.message, msgObject.name],
      ]);
    });

    socket.on("AIMessage", (msgObject) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        ["AI", msgObject.message],
      ]);
    });
  }, []);

  const showHideSideBar = () => {
    document.getElementById("sidebar").classList.toggle("-right-56");
  };

  const sendMessage = () => {
    const inpEleVal = document.getElementById("chatMSG").value;
    if (!inpEleVal) {
      return;
    }
    socket.emit("UserToServer", inpEleVal);

    setMessages((prevMessages) => [...prevMessages, ["SELF", inpEleVal]]);
    document.getElementById("chatMSG").value = "";

    if (String(inpEleVal).startsWith("@NC-AI")) {
      socket.emit("ASKAI", inpEleVal.slice(6));
    }
  };

  const showChatSectionMobile = () => {
    document
      .getElementById("chatSectionContainer")
      .classList.toggle("-right-[100vw]");
  };
  const clearChat = () => {
    setMessages([]);
  };

  if (name) {
    return (
      <>
        <aside className="z-20 lg:w-[40vw] w-screen absolute h-full md:relative p-4 transition-all duration-300  md:py-5 md:px-6 text-lg bg-[#2e2e2e]">
          <div className="flex flex-col gap-4 h-full ">
            <header className="flex flex-row text-sm justify-around">
              {/* Close Chat Area Button */}
              <button
                className="mr-auto flex flex-row gap-1 items-center "
                onClick={openFunction}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                    clip-rule="evenodd"
                  />
                </svg>
                Close
              </button>
              <button
                className="ml-auto flex flex-row gap-1 items-center"
                onClick={clearChat}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-4"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                    clip-rule="evenodd"
                  />
                </svg>
                Clear Chat
              </button>
            </header>
            {/* Message Display Area */}
            <div className="flex overflow-y-auto w-full bg-transparent rounded-lg  py-2 flex-1 flex-col gap-5">
              {messages.map((msgItem, index) => {
                switch (msgItem[0]) {
                  case "SYSTEM":
                    return <SystemMSG key={index} msg={msgItem[1]}></SystemMSG>;
                  case "USER":
                    return (
                      <UserMSG
                        key={index}
                        msg={msgItem[1]}
                        name={msgItem[2]}
                      ></UserMSG>
                    );
                  case "SELF":
                    return (
                      <UserMSG
                        key={index}
                        msg={msgItem[1]}
                        name={name}
                        sending={true}
                      ></UserMSG>
                    );
                  case "AI":
                    return <AIMSG key={index} msg={msgItem[1]}></AIMSG>;
                }
              })}
            </div>

            {/* Message Sending Area */}
            <div className="flex w-full flex-row items-center">
              <button  className="  bg-gray-500 bg-opacity-35 px-2 h-full  rounded-md rounded-r-none"
                onClick={() => {
                  document.getElementById("chatMSG").value = "@NC-AI ";
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="size-6 fill-blue-400"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <input
                type="text"
                className=" w-full bg-white h-fit bg-opacity-5 px-4 py-2 outline-none focus:outline-none rounded-md rounded-l-none"
                id="chatMSG"
                onKeyDown={(key) => {
                  key.key == "Enter" ? sendMessage() : null;
                }}
              />
              <button id="sendButton" onClick={sendMessage}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentcolor"
                  class="size-6"
                >
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
              </button>
            </div>
          </div>
        </aside>
      </>
    );
  } else {
    return (
      <>
        {" "}
        <aside className="z-20 lg:w-[40vw] w-screen absolute h-full md:relative transition-all duration-300  md:py-5 md:px-6 text-lg bg-[#262626]">
          <div className="h-full w-full text-lg font-semibold p-5 flex flex-col justify-center align-middle text-center gap-5">
            <h2 className="text-2xl text-red-600 font-bold">
              Sign In Required
            </h2>
            You Need To Sign In to Chat
            <Link to={"/login"}>
              <button className="bg-white px-4 py-2 text-xl  lg:text-2xl text-black font-semibold rounded-md">
                Login
              </button>
            </Link>
            OR
            <button
              className="bg-white text-lg font-semibold text-black px-5 py-2 rounded-lg mx-auto flex flex-row gap-3 items-center"
              onClick={openFunction}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clip-rule="evenodd"
                />
              </svg>
              Close Chat Section
            </button>
          </div>
        </aside>
      </>
    );
  }
}

export default ChatSection;

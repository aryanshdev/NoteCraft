import { useCallback, useEffect, useState } from "react";
import { socket } from "../lib/socket";
import Icon from "./Icons";
import SystemMSG from "./SystemMSG";
import UserMSG from "./UserMSG";
import { useNavigate, Link } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import AIMSG from "./AIMSG.jsx";
import LoaderDisplay from "../LoaderDisplay.jsx";

function ChatSection({ id, openFunction }) {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const [name, setName] = useState();
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    fetch("https://notecraftai-xct5.onrender.com/app/account/getName", {
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

          break;
      }
    });
  }, []);

  const redirectLogin = () => {
    var path = document.location.href.split("shared")[1];
    localStorage.setItem("__rdi", path);
    navigate("/login");
  };

  useEffect(() => {
    // Use refs to persist values between renders
    const intentionalDisconnect = { current: false };
    const reconnectTimer = { current: null };
    const reconnectAttempts = { current: 0 };
    const MAX_RECONNECT_ATTEMPTS = 20;

    const handleSystem = (msg) => {
      setMessages((prev) => [...prev, ["SYSTEM", msg]]);
    };

    const handleDisconnect = (_) => {
      setMessages((prev) => [...prev, ["SYSTEM", `Disconnected From Server`]]);
      setIsConnected(false);

      // Only attempt reconnect for non-intentional disconnects
      if (
        !intentionalDisconnect.current &&
        reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS
      ) {
        // Clear any existing timer
        if (reconnectTimer.current) {
          clearTimeout(reconnectTimer.current);
        }

        // Calculate exponential backoff delay (1s, 2s, 4s, 8s... max 30s)
        const delay = Math.min(
          1000 * Math.pow(2, reconnectAttempts.current),
          30000
        );
        reconnectAttempts.current += 1;

        reconnectTimer.current = setTimeout(() => {
          if (!intentionalDisconnect.current) {
            socket.connect();
          }
        }, delay);
      }
    };

    const handleConnect = () => {
      setIsConnected(true);
      intentionalDisconnect.current = false;
      reconnectAttempts.current = 0;

      // Clear any pending reconnect timers
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }

      // Rejoin room if we have an ID and name
      if (id && name) {
        socket.emit("createRoom", [id, name]);
      }
    };

    const handleConnectError = (error) => {
      console.error("Connection error:", error);
    };

    const handleUser = (msgObject) => {
      setMessages((prev) => [
        ...prev,
        ["USER", msgObject.message, msgObject.name],
      ]);
    };

    const handleServerToUser = () => {
      // Using a ref for input element is better than global variable
      const message = inputRef.current?.value || "";
      if (message) {
        socket.emit("UserToServer", message);
        setMessages((prev) => [...prev, ["SELF", message]]);
      }
    };

    const handleAIQuestion = (msgObject) => {
      console.log(messages);
      setMessages((prev) => [
        ...prev,
        ["USER", msgObject.message, msgObject.name],
      ]);
    };

    const handleAIMessage = (msgObject) => {
      setMessages((prev) => [...prev, ["AI", msgObject.message]]);
    };

    // Attach listeners
    socket.on("SYSTEM", handleSystem);
    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
    socket.on("USER", handleUser);
    socket.on("ServerToUser", handleServerToUser);
    socket.on("AIQUESTION", handleAIQuestion);
    socket.on("AIMessage", handleAIMessage);

    // Debugging events
    socket.on("reconnect_attempt", (attempt) => {});

    socket.on("reconnect_error", (error) => {
      console.error("Reconnection error:", error);
    });

    // Override disconnect method to mark as intentional
    const originalDisconnect = socket.disconnect;
    socket.disconnect = () => {
      intentionalDisconnect.current = true;
      originalDisconnect.call(socket);
    };

    // Initial connection if not already connected
    if (!socket.connected && !intentionalDisconnect.current) {
      socket.connect();
    }

    // Cleanup
    return () => {
      // Mark disconnect as intentional
      intentionalDisconnect.current = true;

      // Clear any pending reconnect timers
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }

      // Remove all listeners
      socket.off("SYSTEM", handleSystem);
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
      socket.off("USER", handleUser);
      socket.off("ServerToUser", handleServerToUser);
      socket.off("AIQUESTION", handleAIQuestion);
      socket.off("AIMessage", handleAIMessage);
      socket.off("reconnect_attempt");
      socket.off("reconnect_error");

      // Disconnect if connected
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [id, name]);

  const showHideSideBar = () => {
    document.getElementById("sidebar").classList.toggle("-right-56");
  };

  const sendMessage = () => {
    let inpEleVal = document.getElementById("chatMSG").value;
    inpEleVal = inpEleVal.trim();
    if (!inpEleVal) {
      document.getElementById("chatMSG").value = "";

      return;
    }
    socket.emit("UserToServer", inpEleVal);

    setMessages((prevMessages) => [...prevMessages, ["SELF", inpEleVal]]);
    document.getElementById("chatMSG").value = "";

    if (String(inpEleVal).startsWith("@NC-AI")) {
      var sendingMSG = messages
        .filter((ele) => ele[0] !== "SYSTEM")
        .slice(messages.length - 12);
      socket.emit("ASKAI", [...sendingMSG, ["SELF", inpEleVal.slice(6)]]);
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
        <aside className="z-20 lg:w-[34rem] w-screen absolute h-full md:relative transition-all duration-300 border-l border-ink-700 bg-ink-950 text-base">
          <div className="flex flex-col h-full">
            <header className="flex flex-row items-center gap-3 border-b border-ink-700 px-4 py-3 md:px-6 md:py-4">
              <div>
                <p className="font-semibold leading-tight">Group chat</p>
                <p className="eyebrow !text-[10px]">
                  {isConnected ? "Live · mention @NC-AI to ask the assistant" : "Connecting…"}
                </p>
              </div>
              <button
                className="ml-auto inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-ink-400 hover:bg-white/5 hover:text-ink-100"
                onClick={clearChat}
              >
                <Icon name="trash" className="size-4" /> Clear
              </button>
              <button
                className="grid h-8 w-8 place-items-center rounded-md text-ink-300 hover:bg-white/5 hover:text-ink-100"
                onClick={openFunction}
                aria-label="Close chat"
              >
                <Icon name="x" className="size-5" />
              </button>
            </header>

            {/* Message Display Area */}
            <div className="scrollbar-invisible flex overflow-y-auto w-full flex-1 flex-col gap-5 px-4 py-5 md:px-6">
              {messages.length === 0 ? (
                <div className="m-auto max-w-xs text-center text-ink-400">
                  <p className="font-hand text-2xl font-bold text-ink-300">Nothing here yet.</p>
                  <p className="mt-1 text-sm">
                    Talk to collaborators, or start a message with{" "}
                    <span className="rounded bg-marker px-1 font-mono text-xs font-medium text-ink-950">@NC-AI</span>{" "}
                    to ask about your notes.
                  </p>
                </div>
              ) : null}
              {messages.map((msgItem, index) => {
                switch (msgItem[0]) {
                  case "SYSTEM":
                    return <SystemMSG key={index} msg={msgItem[1]}></SystemMSG>;
                  case "USER":
                    return <UserMSG key={index} msg={msgItem[1]} name={msgItem[2]}></UserMSG>;
                  case "SELF":
                    return <UserMSG key={index} msg={msgItem[1]} name={name} sending={true}></UserMSG>;
                  case "AI":
                    return <AIMSG key={index} msg={msgItem[1]}></AIMSG>;
                }
              })}
            </div>

            {/* Message Sending Area */}
            <div className="border-t border-ink-700 p-3 md:px-6 md:py-4">
              {isConnected ? (
                <div className="flex w-full flex-row items-end gap-2 rounded-lg border border-ink-600 bg-ink-900 p-1.5 focus-within:border-ink-400">
                  <button
                    className="relative shrink-0 rounded-md px-2 py-1.5 font-mono text-xs font-medium text-ink-300 hover:bg-marker hover:text-ink-950"
                    title="Mention NC-AI"
                    onClick={() => {
                      document.getElementById("mentionAIhover").classList.add("hidden");
                      const box = document.getElementById("chatMSG");
                      if (!box.value.startsWith("@NC-AI")) box.value = "@NC-AI " + box.value;
                      box.focus();
                    }}
                  >
                    <div
                      className="absolute bottom-full left-0 mb-3 w-56 rounded-md bg-marker px-3 py-2 text-left font-sans text-sm font-medium text-ink-950 shadow-lg"
                      id="mentionAIhover"
                    >
                      Tap to mention the assistant
                      <div className="absolute -bottom-1.5 left-4 h-3 w-3 rotate-45 bg-marker"></div>
                    </div>
                    @NC-AI
                  </button>
                  <textarea
                    type="text"
                    placeholder="Write a message…"
                    rows={1}
                    className="w-full resize-none bg-transparent px-2 py-1.5 outline-none placeholder:text-ink-400"
                    onFocus={() => {
                      document.getElementById("mentionAIhover").classList.add("hidden");
                    }}
                    id="chatMSG"
                    onKeyDown={(key) => {
                      key.key === "Enter" && !key.shiftKey ? sendMessage() : null;
                    }}
                  />
                  <button
                    id="sendButton"
                    onClick={sendMessage}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-ink-100 text-ink-950 hover:bg-marker"
                    aria-label="Send"
                  >
                    <Icon name="send" className="size-4" strokeWidth={2} />
                  </button>
                </div>
              ) : (
                <div className="eyebrow py-3 text-center">Connecting to chat…</div>
              )}
            </div>
          </div>
        </aside>
      </>
    );
  } else {
    return (
      <>
        <aside className="z-20 lg:w-[34rem] w-screen absolute h-full md:relative transition-all duration-300 border-l border-ink-700 bg-ink-950">
          <div className="h-full w-full p-8 flex flex-col justify-center items-center text-center gap-4">
            <p className="eyebrow">Chat</p>
            <h2 className="text-2xl font-semibold">Sign in to join the conversation</h2>
            <p className="max-w-xs text-ink-300">
              Chat with collaborators and ask NC-AI about these notes once you're logged in.
            </p>
            <div className="mt-2 flex gap-3">
              <button className="btn-primary" onClick={redirectLogin}>
                Log in
              </button>
              <button className="btn-ghost" onClick={openFunction}>
                Close
              </button>
            </div>
          </div>
        </aside>
      </>
    );
  }
}

export default ChatSection;

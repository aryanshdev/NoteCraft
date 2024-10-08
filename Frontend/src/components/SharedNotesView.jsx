import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import { socket } from "../lib/socket.js";
import CreateNote from "./CreateNewNote";
import { Link } from "react-router-dom";
import NoteDisplay from "./NoteDisplay.jsx";
import LoaderDisplay from "../LoaderDisplay.jsx";
import ChatSection from "./ChatSection.jsx";
import AppBar from "./AppBar.jsx";
function SharedNotes() {
  const [userNotes, setUserNotes] = useState([]);
  const [loggedName, setLoggedName] = useState({});
  const [isEditor, setIsEditor] = useState(false);
  const getids = useParams();
  const navigate = useNavigate();

  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/app/account/getName", {
      method: "GET",
      credentials: "include",
    }).then(async (res) => {
      switch (res.status) {
        case 401:
          setLoggedName(null);
          return false;
        case 500:
          navigate("/500");
        case 200:
          let uname = await res.text();
          setLoggedName(uname);
          break;
      }
    });
  }, []);

  useEffect(() => {
    fetch("/sharing/sharedGetAll", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: getids.userID, gid: getids.groupID }),
    })
      .then((res) => {
        console.log(res);
        if (res.status == 401) {
          navigate("/401");
          return false;
        }
        if (res.status == 404) {
          navigate("/404");
          return false;
        }
        return res.json();
      })
      .then((res) => {
        setUserNotes(res["notes"]);
        setIsEditor(res["editor"]);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Failed to fetch notes");
      });
  }, [navigate]);

  const updateNoteInfo = useCallback(
    async (event) => {
      var ele = event.target.parentElement.parentElement.parentElement;
      var title = ele.querySelector("input").value;
      var desc = ele.querySelector("textarea").value;
      var id = ele.getAttribute("id");
      const res = await fetch("/sharing/updateShared", {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          title: title,
          description: desc,
          gid: getids.groupID,
          uid: getids.userID,
          nid: id,
        }), // Use JSON.stringify
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        toast.success("Details Updated");
        return true; // Return true on success
      } else if (res.status == 400) {
        toast.warning("Check Inputs And Try Again");
        return false; // Return false for input error
      } else if (res.status == 401) {
        toast.error("Session Expired, Please Login Again");
        return false;
      } else {
        toast.error("Some Error Occurred");
        return false; // Return false for other errors
      }
    },
    [setUserNotes, userNotes]
  );
  const favouriteSet = async (noteID, isFav) => {
    let res = await fetch("/sharing/editFavouriteShared", {
      credentials: "include",
      body: JSON.stringify({
        gid: getids.groupID,
        uid: getids.userID,
        nid: noteID,
        favStatus: isFav,
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status == 200) {
      toast.success(isFav ? "Favourite Added" : "Favourite Removed");
      socket.emit("shared_EDITFAV", loggedName, noteID);
      return true;
    } else {
      toast.error("Something Went Wrong");
      return false;
    }
  };

  const showChatSection = () => {
    document
      .getElementById("chatSectionContainer")
      .classList.toggle("-right-[100vw]");
    document
      .getElementById("chatSectionContainer")
      .classList.toggle("md:right-0");
  };

  const showChatAndAsk = (task) => {
    document
      .getElementById("chatSectionContainer")
      .classList.remove("-right-[100vw]");
    document.getElementById("chatSectionContainer").classList.add("md:right-0");
    socket.emit("ASKAI", task);
  };
  const loginWarning = () => {
    toast.warning("You Need To Login To Make Changes");
  };
  const editorWarning = () => {
    toast.warning("Ask Note Group Owner To Add You As Editor ");
  };
  const deleteNote = async (nid) => {
    const deleteInnerFunc = async (inpid) => {
      await fetch("/sharing/deleteShared", {
        credentials: "include",
        body: JSON.stringify({
          gid: getids.groupID,
          uid: getids.userID,
          nid: inpid,
        }),
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.status == 200) {
          toast.success("Note Deleted.");

          setUserNotes(userNotes.filter((note) => note.noteID !== inpid));
        }
      });
    };

    var id = toast(
      <>
        <div>Confirm Delete?</div>
        <button
          className="bg-gray-800 py-2 my-2 px-3"
          onClick={() => {
            deleteInnerFunc(nid);
            toast.dismiss(id);
          }}
        >
          Delete
        </button>
        <button
          className="bg-gray-800 py-2 my-2 px-3 ml-7"
          onClick={() => {
            toast.dismiss(id);
          }}
        >
          Cancel
        </button>
      </>
    );
  };
  if (Loading) {
    return (
      <div className="w-screen h-screen flex">
        <LoaderDisplay />
      </div>
    );
  } else {
    return (
      <>
        {" "}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition:Bounce
        />
        <div className="bg-orange-600 bg-blue-600 bg-yellow-600 bg-green-600 bg-pink-600 hidden h-0 w-0"></div>
        <div className="flex flex-row overflow-x-clip w-auto ">
          <header className=" dark:bg-[#2c2c2c] h-auto flex fixed dark:text-white text-black py-2 px-5 w-full md:hidden flex-row ">
            {/* AI CHAT BUTTON */}
            <p className="font-semibold my-auto text-lg"> NodeCraft</p>
            <button
              data-drawer-target="default-sidebar"
              data-drawer-toggle="default-sidebar"
              aria-controls="default-sidebar"
              type="button"
              onClick={showChatSection}
              className="inline-flex items-center m-1 px-4 text-sm text-gray-300 rounded-lg sm:hidden ml-auto mr-0"
            >
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </header>
          <div className="w-full md:w-[97%] h-screen py-5 px-4 md:pl-0 md:pr-4 mt-16 md:mt-0">
            <h3 className="text-lg font-semibold px-4">
              Take a Look At Notes or Create More Below
            </h3>

            <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-5 px-4">
              {loggedName ? (
                isEditor ? (
                  <CreateNote
                    already={userNotes.length}
                    getids={getids.groupID}
                    navigator={navigate}
                  ></CreateNote>
                ) : (
                  <div
                    className={`w-full h-52 rounded-md border-2 border-dotted p-2 bg-blue-800 bg-opacity-10 text-center flex items-center gap-6 flex-col justify-center`}
                  >
                    <h2 className="text-lg font-semibold m-auto">
                      You Need To Be An Editor To Create New Notes
                    </h2>
                    <p className="h-auto m-auto">
                      {" "}
                      Ask Note Group Owner To Add Your Email In Editors List
                    </p>
                  </div>
                )
              ) : (
                <div
                  className={`w-full h-52 rounded-md border-2 border-dotted p-2 bg-blue-800 bg-opacity-10 text-center flex items-center gap-7 flex-col justify-center`}
                >
                  <h2 className="text-lg font-semibold my-auto">
                    You Need To Login To Add Notes To This Group
                  </h2>
                  <Link to={"/login"} className="my-auto">
                    <button className="bg-white px-4 py-2 text-xl  text-black font-semibold rounded-md">
                      Login
                    </button>
                  </Link>
                </div>
              )}
              {userNotes.map((note, index) => (
                <NoteDisplay
                  _title={note.title}
                  _description={note.body}
                  id={note.noteID}
                  key={note.noteID}
                  updateFunc={
                    loggedName
                      ? isEditor
                        ? updateNoteInfo
                        : editorWarning
                      : loginWarning
                  }
                  isFav={note.favourite}
                  favFunction={
                    loggedName
                      ? isEditor
                        ? favouriteSet
                        : editorWarning
                      : loginWarning
                  }
                  delFunction={
                    loggedName
                      ? isEditor
                        ? deleteNote
                        : editorWarning
                      : loginWarning
                  }
                  aiChatFunction={showChatAndAsk}
                  color={
                    ["orange", "blue", "yellow", "green", "pink"][
                      Math.floor(Math.random() * 5)
                    ]
                  }
                ></NoteDisplay>
              ))}
            </div>
          </div>
          <button
            className="hidden md:flex bg-white w-[3%] text-white justify-center items-center px-1 flex-col bg-opacity-10 my-5 rounded-l-xl"
            onClick={showChatSection}
          >
            <span className="origin-center rotate-90 text-lg font-semibold  transform block w-[100vh] ">
              Open NodeCraft AI Chat
            </span>
          </button>
          <div
            className="fixed -right-[100vw] z-40 h-full"
            id="chatSectionContainer"
          >
            <ChatSection
              id={getids.groupID}
              openFunction={showChatSection}
            ></ChatSection>
          </div>
        </div>
      </>
    );
  }
}
export default SharedNotes;

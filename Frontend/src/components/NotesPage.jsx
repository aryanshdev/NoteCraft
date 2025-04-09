import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { Slide, toast, ToastContainer } from "react-toastify";
import CreateNote from "./CreateNewNote";
import NotesPageSideBar from "./NotesPageSideBar.jsx";
import NoteDisplay from "./NoteDisplay.jsx";
import LoaderDisplay from "../LoaderDisplay.jsx";
import ChatSection from "./ChatSection.jsx";
import { socket } from "../lib/socket.js";
import ShareNote_AddUsers from "./ShareNote_AddUsers.jsx";

function NotesPage() {
  const [userNotes, setUserNotes] = useState([]);
  const gid = useParams();
  const navigate = useNavigate();
  const bgColors = useRef([]);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:10000/app/notes/getAll", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: gid.groupID }),
    })
      .then((res) => {
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
        setUserNotes(res);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Failed to fetch notes");
      });
  }, [navigate]);

  //Collab Events
  useEffect(() => {
    socket.on("shared_NoteDelete", (nid, name) => {
      toast(name + " Deleted A Note", {
        icon: ({ theme, type }) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-5"
          >
            <path
              fill-rule="evenodd"
              d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
              clip-rule="evenodd"
            />
          </svg>
        ),
        position: "bottom-left",
        autoClose: 1500,
        closeOnClick: true,
        pauseOnHover: false,
        transition: Slide,
      });
      setUserNotes((userNotes) => {
        return userNotes.filter((notes) => notes.noteID !== nid);
      });
    });
    socket.on("shared_NoteAdded", (details, name) => {
      toast(name + " Added A Note", {
        icon: ({ theme, type }) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-5"
          >
            <path
              fill-rule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clip-rule="evenodd"
            />
          </svg>
        ),
        position: "bottom-left",
        autoClose: 1500,
        closeOnClick: true,
        pauseOnHover: false,
        transition: Slide,
      });
      setUserNotes((userNotes) => [
        ...userNotes,
        {
          body: details.body,
          favourite: false,
          groupID: gid.groupID,
          noteID: details.noteID,
          title: details.title,
        },
      ]);
    });
    socket.on("shared_NoteUpdate", (details, name) => {
      toast(name + " Updated A Note", {
        icon: ({ theme, type }) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-5"
          >
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
          </svg>
        ),
        position: "bottom-left",
        autoClose: 1500,
        closeOnClick: true,
        pauseOnHover: false,
        transition: Slide,
      });
      setUserNotes((userNotes) => {
        return userNotes.map((note) => {
          if (note.noteID === details.nid) {
            return {
              ...note, 
              title: details.title,
              body: details.description,
            };
          }
          return note;
        });
      });
    });
    socket.on("shared_AlterFavourite", (nid, name) => {
      toast(name + " Changed Favourities", {
        icon: ({ theme, type }) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-5"
          >
            <path
              fill-rule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clip-rule="evenodd"
            />
          </svg>
        ),
        position: "bottom-left",
        autoClose: 1500,
        closeOnClick: true,
        pauseOnHover: false,
        transition: Slide,
      });
      setUserNotes((userNotes) =>
        userNotes.map((note) => {
          return note.noteID === nid
            ? { ...note, favourite: !note.favourite }
            : note;
        })
      );
    });
  }, []);

  const updateNote = useCallback(
    async (event) => {
      var ele = event.target.parentElement.parentElement.parentElement;
      var title = ele.querySelector("input").value;
      var desc = ele.querySelector("textarea").value;
      var id = ele.getAttribute("id");
      const res = await fetch("http://localhost:10000/app/notes/update", {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          title: title,
          description: desc,
          gid: gid.groupID,
          nid: id,
        }), // Use JSON.stringify
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        toast.success("Details Updated");
        socket.emit(
          "shared_NoteUpdate",
          { title: title, description: desc, nid: id },
          "Owner"
        );
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
    let res = await fetch("http://localhost:10000/app/notes/editFavourite", {
      credentials: "include",
      body: JSON.stringify({
        gid: gid.groupID,
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
      socket.emit("shared_AlterFavourite", noteID, "Owner");
      return true;
    } else {
      toast.error("Something Went Wrong");
      return false;
    }
  };

  const showChatAndAsk = (task) => {
    document
      .getElementById("chatSectionContainer")
      .classList.remove("-right-[100vw]");
    document.getElementById("chatSectionContainer").classList.add("md:right-0");
    socket.emit("ASKAI", task);
  };

  const showChatSection = () => {
    document
      .getElementById("chatSectionContainer")
      .classList.toggle("-right-[100vw]");
    document
      .getElementById("chatSectionContainer")
      .classList.toggle("md:right-0");
  };

  const showSharing = () => {
    document.getElementById("shareOverlay").classList.toggle("!hidden");
  };

  const addNewNote = (title, bodyContent, newNoteID) => {
    console.log(title)
    setUserNotes((userNotes) => [
      ...userNotes,
      {
        body: bodyContent,
        favourite: false,
        groupID: gid.groupID,
        noteID: newNoteID,
        title: title,
      },
    ]);
    socket.emit(
      "shared_NoteAdded",
      {
        body: bodyContent,
        noteID: newNoteID,
        title: title,
      },
      "Owner"
    );
  };
  const deleteNote = async (nid) => {
    const deleteInnerFunc = async (inpid) => {
      await fetch("http://localhost:10000/app/notes/deleteNote", {
        credentials: "include",
        body: JSON.stringify({
          nid: inpid,
          gid: gid.groupID,
        }),
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.status == 200) {
          toast.success("Note Deleted.");

          socket.emit("shared_NoteDelete", inpid, "Owner");
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
    if (bgColors.current.length !== userNotes.length) {
      bgColors.current = userNotes.map(
        () =>
          ["orange", "blue", "yellow", "green", "pink", "purple"][
            Math.floor(Math.random() * 6)
          ]
      );
    }
    return (
      <>
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
        <div className="bg-orange-600 bg-blue-600 bg-yellow-600 bg-green-600 bg-pink-600 bg-purple-600 hidden h-0 w-0"></div>
        <div className="flex flex-row overflow-x-clip">
          <ShareNote_AddUsers
            gid={gid.groupID}
            closeFunction={showSharing}
          ></ShareNote_AddUsers>
          <NotesPageSideBar shareFunction={showSharing} />
          <div className="w-full md:w-[97%] h-screen py-5 px-4 md:pl-0 md:pr-4 mt-16 md:mt-0">
            <h3 className="text-lg font-semibold">
              Take a look at your Notes or Create More Below
            </h3>

            <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-5">
              <CreateNote
                already={userNotes.length}
                gid={gid.groupID}
                addNewNote={addNewNote}
                navigator={navigate}
              ></CreateNote>
              {userNotes.map((note, index) => (
                <NoteDisplay
                  _title={note.title}
                  _description={note.body}
                  id={note.noteID}
                  key={note.noteID}
                  updateFunc={updateNote}
                  isFav={note.favourite}
                  favFunction={favouriteSet}
                  delFunction={deleteNote}
                  aiChatFunction={showChatAndAsk}
                  color={bgColors.current[index]}
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
              id={gid.groupID}
              openFunction={showChatSection}
            ></ChatSection>
          </div>
        </div>
      </>
    );
  }
}
export default NotesPage;

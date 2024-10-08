import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
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

  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/app/notes/getAll", {
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

  const updateNote = useCallback(
    async (event) => {
      var ele = event.target.parentElement.parentElement.parentElement;
      var title = ele.querySelector("input").value;
      var desc = ele.querySelector("textarea").value;
      var id = ele.getAttribute("id");
      const res = await fetch("/app/notes/update", {
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
    let res = await fetch("/app/notes/editFavourite", {
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
  };
  const deleteNote = async (nid) => {
    const deleteInnerFunc = async (inpid) => {
      await fetch("/app/notes/deleteNote", {
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
        <div className="flex flex-row overflow-x-clip w-screen">
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

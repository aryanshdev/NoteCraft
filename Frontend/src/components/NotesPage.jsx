import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import CreateNote from "./CreateNewNote";
import NotesPageSideBar from "./NotesPageSideBar.jsx";
import NoteDisplay from "./NoteDisplay.jsx";

function NotesPage() {
  const [userNotes, setUserNotes] = useState([]);
  const gid = useParams();
  const Greeting =
    new Date().getHours() < 12
      ? "Morning"
      : new Date().getHours() < 16
      ? "Afternoon"
      : "Evening";

  useEffect(() => {
    fetch("/app/notes/getAll", {
      method: "POST",
      body: JSON.stringify({ id: gid.groupid }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status == 401) {
          toast.error("Session Expired, Please Login Again");
        }
        console.log(res);
        setUserNotes(res);
      })
      .catch((error) => {
        toast.error("Failed to fetch notes");
      });
  }, []);

  const updateGroupInfo = useCallback(
    async (event) => {
      var ele = event.target.parentElement.parentElement.parentElement;
      var title = ele.querySelector("input").value;
      var desc = ele.querySelector("textarea").value;
      var id = ele.getAttribute("id");
      const res = await fetch("/app/notesgroup/update?id=" + id, {
        method: "POST",
        body: JSON.stringify({ title: title, description: desc }), // Use JSON.stringify
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
  const favouriteSet = async (groupID, isFav) => {
    let res = await fetch("/app/notesgroup/editFavourite", {
      body: JSON.stringify({
        id: groupID,
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

  const deleteNoteGroup = async (groupID) => {
    const deleteInnerFunc = async (inpid) => {
      await fetch("/app/notesgroup/deleteNoteGroup", {
        body: JSON.stringify({
          id: inpid,
        }),
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.status == 200) {
          toast.success("Note Group Deleted.");
          setUserNotes(userNotes.filter((group) => group.groupID != inpid));
        }
      });
    };

    var id = toast(
      <>
        <div>Confirm Delete?</div>
        <button
          className="bg-gray-800 py-2 my-2 px-3"
          onClick={() => {
            deleteInnerFunc(groupID);
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
      <div className="flex flex-row">
        <NotesPageSideBar />
        <div className="w-full h-screen py-5 px-4 md:pl-0 md:pr-4 mt-16 md:mt-0">
          <h3>Take a look at your Notes or Create More Below</h3>

          <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-5">
            <CreateNote
              already={userNotes.length}
              gid={gid.groupid}
            ></CreateNote>
            {userNotes.map((note, index) => (
              <NoteDisplay
                _title={note.title}
                _description={note.body}
                id={note.noteID}
                updateFunc={updateGroupInfo}
                isFav={true}
                favFunction={favouriteSet}
                delFunction={deleteNoteGroup}
                color={
                  ["orange", "blue", "yellow", "green", "pink"][
                    Math.floor(Math.random() * 5)
                  ]
                }
              ></NoteDisplay>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default NotesPage;

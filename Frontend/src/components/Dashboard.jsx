import { useEffect, useState, useCallback } from "react";
import NoteGroupDisplay from "./NoteGroupDisplay";
import CreateNoteGroup from "./CreateNewNoteGroup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const [userNotes, setUserNotes] = useState([]);
  console.log("Render");
  const Greeting =
    new Date().getHours() < 12
      ? "Morning"
      : new Date().getHours() < 16
      ? "Afternoon"
      : "Evening";

  useEffect(() => {
    fetch("/app/notesgroup/getAll")
      .then((res) => res.json())
      .then((res) => {
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
      } else {
        toast.error("Some Error Occurred");
        return false; // Return false for other errors
      }
    },
    [setUserNotes, userNotes]
  );
  const favouriteSet = async (event, isFav) => {
    let res = await fetch("/app/notesgroup/editFavourite", {
      body: JSON.stringify({
        id: event.target.parentElement.parentElement.parentElement.getAttribute(
          "id"
        ),
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

  const deleteNoteGroup = async (event) => {
    const groupID =
      event.target.parentElement.parentElement.parentElement.getAttribute("id");
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
          setUserNotes(userNotes.filter(group=>group.groupID != inpid))
        }
      });
    };

    toast(
      <>
        <div>Confirm Delete?</div>
        <button
          className="bg-gray-800 py-2 my-2 px-3"
          onClick={() => {
            deleteInnerFunc(groupID);
          }}
        >
          Delete
        </button>
        <button className="bg-gray-800 py-2 my-2 px-3 ml-7">Cancel</button>
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
      <h1 className="font-semibold text-3xl mb-3">Good {Greeting}, Aryansh</h1>
      <h3>Take a look at your Notes or Create More Below</h3>
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-5">
        {userNotes.length < 8 ? (
          <CreateNoteGroup already={userNotes.length}></CreateNoteGroup>
        ) : (
          " "
        )}

        {userNotes.map((note, index) => (
          <NoteGroupDisplay
            updateFunc={updateGroupInfo}
            id={note.groupID}
            key={note.groupID}
            _title={note.title}
            _description={note.description}
            isFav={note.favourite}
            favFunction={favouriteSet}
            delFunction={deleteNoteGroup}
          />
        ))}
      </div>
    </>
  );
}

export default Dashboard;

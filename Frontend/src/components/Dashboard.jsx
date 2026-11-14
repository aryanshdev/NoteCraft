import { useEffect, useState, useCallback } from "react";
import NoteGroupDisplay from "./NoteGroupDisplay";
import CreateNoteGroup from "./CreateNewNoteGroup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import LoaderDisplay from "../LoaderDisplay";
import { colorFor } from "../lib/utils";

function Dashboard() {
  const [userNotes, setUserNotes] = useState([]);
  const [name, setName] = useState("User");
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(true);
  const Greeting =
    new Date().getHours() < 12
      ? "Morning"
      : new Date().getHours() < 16
      ? "Afternoon"
      : "Evening";

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

  useEffect(() => {
    if (localStorage.getItem("__rdi")) {
      var loc = localStorage.getItem("__rdi")
      localStorage.removeItem("__rdi")
      window.location.href =
        "https://notecraft-ai.onrender.com/shared" + loc;
      return;
    }

    fetch("https://notecraftai-xct5.onrender.com/app/notesgroup/getAll", {
      method: "GET",
      credentials: "include", // Include cookies
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        switch (res.status) {
          case 401:
            navigate("/401");
            return false;
          case 500:
            navigate("/500");
        }
        return res.json();
      })
      .then((res) => {
        setUserNotes(res);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Failed To Fetch Notes");
      });
  }, [navigate]);

  const updateGroupInfo = useCallback(
    async (event) => {
      var ele = event.target.closest("[data-card]");
      var title = ele.querySelector("input").value;
      var desc = ele.querySelector("textarea").value;
      var id = ele.getAttribute("id");
      const res = await fetch("https://notecraftai-xct5.onrender.com/app/notesgroup/update", {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({ title: title, description: desc, id: id }), // Use JSON.stringify
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
    let res = await fetch(
      "https://notecraftai-xct5.onrender.com/app/notesgroup/editFavourite",
      {
        credentials: "include",
        body: JSON.stringify({
          id: groupID,
          favStatus: isFav,
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
      await fetch("https://notecraftai-xct5.onrender.com/app/notesgroup/deleteNoteGroup", {
        credentials: "include",
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
          className="btn-danger !py-1.5 my-2 text-sm"
          onClick={() => {
            deleteInnerFunc(groupID);
            toast.dismiss(id);
          }}
        >
          Delete
        </button>
        <button
          className="btn-ghost !py-1.5 my-2 ml-3 text-sm"
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
    return <LoaderDisplay />;
  } else {
    return (
      <>
        <header className="flex flex-col gap-1 border-b border-ink-700 pb-5 pt-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-2">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <h1 className="page-title">
              Good {Greeting.toLowerCase()}
              {name ? (
                <>
                  , <span className="marked">{name}</span>
                </>
              ) : null}.
            </h1>
            <p className="mt-2 text-ink-300">
              Pick up a group where you left off, or start a fresh one.
            </p>
          </div>
          <p className="eyebrow mt-3 md:mt-0">
            {userNotes.length} / 8 groups
          </p>
        </header>
        <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10 mt-10 pb-16">
          {userNotes.length < 8 ? (
            <div className="mt-4">
              <CreateNoteGroup already={userNotes.length}></CreateNoteGroup>
            </div>
          ) : null}

          {userNotes.map((noteGroup) => (
            <NoteGroupDisplay
              updateFunc={updateGroupInfo}
              id={noteGroup.groupID}
              key={noteGroup.groupID}
              _title={noteGroup.title}
              _description={noteGroup.description}
              isFav={noteGroup.favourite}
              favFunction={favouriteSet}
              delFunction={deleteNoteGroup}
              color={colorFor(noteGroup.groupID)}
            />
          ))}
        </div>
      </>
    );
  }
}

export default Dashboard;

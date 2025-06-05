import { useEffect, useState, useCallback } from "react";
import NoteGroupDisplay from "./NoteGroupDisplay";
import CreateNoteGroup from "./CreateNewNoteGroup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import LoaderDisplay from "../LoaderDisplay";

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
      var ele = event.target.parentElement.parentElement.parentElement;
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

  if (Loading) {
    return <LoaderDisplay />;
  } else {
    return (
      <>
        <div className="bg-orange-500 bg-blue-500 bg-yellow-500 bg-red-500 bg-purple-500 bg-green-500 bg-pink-500 hidden h-0 w-0"></div>

        <div className="bg-[#121212] rounded-lg bg-opacity-10 px-3 py-2 backdrop-blur-[1px] backdrop-brightness-200 w-full">
          <h1 className="font-semibold text-3xl mb-3">
            Good {Greeting}, {name}
          </h1>
          <h3 className="text-xl">Take a look at your Note Groups or Create More Below</h3>
        </div>
        <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-5">
          {userNotes.length < 8 ? (
            <CreateNoteGroup already={userNotes.length}></CreateNoteGroup>
          ) : (
            " "
          )}

          {userNotes.map((noteGroup, index) => (
            <NoteGroupDisplay
              updateFunc={updateGroupInfo}
              id={noteGroup.groupID}
              key={noteGroup.groupID}
              _title={noteGroup.title}
              _description={noteGroup.description}
              isFav={noteGroup.favourite}
              favFunction={favouriteSet}
              delFunction={deleteNoteGroup}
              color={
                ["orange", "blue", "yellow", "green", "pink"][
                  Math.floor(Math.random() * 5)
                ]
              }
            />
          ))}
        </div>
      </>
    );
  }
}

export default Dashboard;

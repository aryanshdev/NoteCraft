import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Icon from "./Icons";
import { useNavigate } from "react-router-dom";
function CreateNoteGroup(props) {
  const nav = useNavigate();
  const showHideAddArea = () => {
    addMode.classList.toggle("hidden");
    displayMode.classList.toggle("hidden");
  };

  const addNewGroup = () => {
    fetch("https://notecraftai-xct5.onrender.com/app/notesgroup/new", {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        title: document.getElementById("newTitle").value,
        description: document.getElementById("newDesc").value,
      }), // Use JSON.stringify
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        switch (res.status) {
          case 200:
            showHideAddArea();
            toast.success(
              <>
                New Note Group Created
                <br />
                <em>
                  {" "}
                  <ul>Redirecting</ul>{" "}
                </em>
              </>,
              {
                onClose: async () => nav("/notes/" + (await res.text())),
                autoClose: 2500,
              }
            );
            break;
          case 400:
            toast.warning("Check Inputs And Try Again");
            break;
          case 500:
            toast.error("Something Went Wrong");
            break;
          case 401:
            nav("/401");
            break;
        }
      })
      
  };

  return (
    <div
      className="slot"
    >
      <div
        className="flex justify-center items-center flex-col w-full text-center gap-3 h-full cursor-pointer"
        id="displayMode"
        onClick={showHideAddArea}
      >
        <div
          className="grid h-14 w-14 place-items-center rounded-full border-2 border-dashed border-current"
        >
          <Icon name="plus" className="size-6" strokeWidth={2.2} />
        </div>
        <span className="font-hand text-2xl font-bold">New group</span>
        <span className="eyebrow">{8 - props.already} of 8 left</span>
      </div>
      <div className="hidden flex h-full flex-col px-1" id="addMode">
        <div className="flex-1 overflow-hidden">
          <div className="w-full h-full">
            <input
              type="text"
              placeholder="Title"
              id="newTitle"
              className="slot-input font-hand text-2xl font-bold mb-3"
            />

            <textarea
              type="text"
              id="newDesc"
              placeholder="Description"
              rows={4}
              className="slot-input resize-none"
            />
          </div>
        </div>
        <div className="flex flex-row justify-end gap-2 pt-3">
          <button className="btn-ghost !px-3 !py-1.5 text-sm" onClick={showHideAddArea}>
            Cancel
          </button>
          <button className="btn-primary !px-3 !py-1.5 text-sm" onClick={addNewGroup}>
            <Icon name="check" className="size-4" strokeWidth={2.4} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateNoteGroup;

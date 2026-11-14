import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Icon from "./Icons";

function CreateNoteShared(props) {
  const showHideAddArea = () => {
    addMode.classList.toggle("hidden");
    displayMode.classList.toggle("hidden");
  };
  const addNewGroup = () => {
    fetch("https://notecraftai-xct5.onrender.com/sharing/newNoteShared", {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        title: document.getElementById("newTitle").value,
        description: document.getElementById("newDesc").value,
        gid: props.gid,
        uid : props.owner
      }), // Use JSON.stringify
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (res.status === 200) {
          toast.success("New Note Added");
          props.addNewNote(
            document.getElementById("newTitle").value,
            document.getElementById("newDesc").value,
            await res.text()
          );
        } else if (res.status == 400) {
          toast.warning("Check Inputs And Try Again");
        } else if (res.status == 401) {
          props.navigator("/401");
        } else {
          toast.error("Some Error Occured");
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
          id="addNotButton"
        >
          <Icon name="plus" className="size-6" strokeWidth={2.2} />
        </div>
        <span className="font-hand text-2xl font-bold">New note</span>
        <span className="eyebrow">{20 - props.already} of 20 left</span>
      </div>
      <div className="hidden flex h-full flex-col px-1" id="addMode">
        <div className="flex-1 overflow-hidden">
          <div className="w-full h-full">
            <input
              type="text"
              placeholder="Title"
              id="newTitle"
              className="slot-input font-hand text-2xl font-bold mb-3"
              autoFocus={true}
              required
            />

            <textarea
              required
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

export default CreateNoteShared;

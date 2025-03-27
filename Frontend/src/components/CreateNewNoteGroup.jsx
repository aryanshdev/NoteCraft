import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
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
      .finally(showHideAddArea());
  };

  return (
    <div
      className={`w-full h-52  rounded-md border-2 border-dotted  bg-blue-800 bg-opacity-10`}
    >
      <div
        className="flex justify-center items-center flex-col w-full text-center gap-1 h-full"
        id="displayMode"
      >
        <div
          className=" rounded-full border-2 border-dotted w-24 h-24 flex justify-center align-middle items-center hover:bg-white hover:bg-opacity-10"
          onClick={showHideAddArea}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="3"
            stroke="currentColor"
            class="size-10"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            ></path>
          </svg>
        </div>
        <span className="font-semibold"> Add New Note Group</span>

        <span className="italic">
          {" "}
          You Can Add {8 - props.already} More Groups
        </span>
        <div></div>
      </div>
      <div className="hidden py-2 px-3" id="addMode">
        <div className="h-5/6 overflow-clip">
          <div className="w-full h-full">
            <input
              type="text"
              placeholder="Title"
              id="newTitle"
              className="focus:outline-none outline-none bg-transparent border-b-[1px] border-solid border-gray-500 focus:border-white transition-all duration-150  placeholder:text-gray-300 text-xl w-full mb-2"
            />

            <textarea
              type="text"
              id="newDesc"
              placeholder="Description"
              rows={4}
              className="focus:outline-none outline-none bg-transparent border-b-[1px] border-solid border-gray-500 focus:border-white transition-all duration-150 w-full placeholder:text-gray-300"
            />
          </div>
        </div>
        <div className="flex flex-row justify-end gap-8 pt-1 h-full">
          <button onClick={showHideAddArea}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-8"
            >
              <path
                fill-rule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <button onClick={addNewGroup}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-8"
            >
              <path
                fill-rule="evenodd"
                d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateNoteGroup;

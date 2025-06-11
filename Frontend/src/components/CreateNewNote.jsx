import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CreateNote(props) {

  const showHideAddArea = () => {
    addMode.classList.toggle("hidden");
    document.getElementById("newTitle").value = "";
    document.getElementById("newDesc").value = "";
    displayMode.classList.toggle("hidden");
  };

  const addNewNote = () => {
   if(props.already >= 20) {
      toast.error("You Can Only Add 20 Notes In A Group");
      return;
    }
     fetch("http://localhost:10000/app/notes/new", {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        title: document.getElementById("newTitle").value,
        description: document.getElementById("newDesc").value,
        gid: props.gid,
      }), 
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

          showHideAddArea();
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
      className={`w-full h-52 rounded-md border-2 border-dotted p-2 bg-black bg-opacity-10 backdrop-brightness-200 backdrop-blur-[2px] transition-all duration-300`}
    >
      <div
        className="flex justify-center items-center flex-col w-full text-center gap-1 h-full"
        id="displayMode"
      >
        <div
          className=" rounded-full border-2 border-dotted w-24 h-24 flex justify-center align-middle items-center hover:bg-white hover:bg-opacity-10"
          id="addNotButton"
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
        <span className="font-semibold"> Add New Note</span>

        <span className="italic">
          {" "}
          You Can Add {20 - props.already} More Notes In This Group
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
              autoFocus={true}
              required
            />

            <textarea
              required
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
          <button onClick={addNewNote}>
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

export default CreateNote;

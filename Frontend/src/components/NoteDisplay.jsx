import { useRef, useState, useEffect } from "react";
import React from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const NoteDisplay = ({
  _title,
  _description,
  id,
  updateFunc,
  isFav,
  favFunction,
  delFunction,
  aiChatFunction,
  color,
}) => {
  const [title, setTitle] = useState(_title);
  const [description, setDescription] = useState(_description);
  const [isFavourite, setIsFavourite] = useState(isFav);

  useEffect(() => {
    setTitle(_title);
    setDescription(_description);
  }, [_title, _description]);

  // Reference to the component to access DOM elements
  const cardRef = useRef(null);

  const saveTitleDesc = async (event) => {
    let success = await updateFunc(event);
    if (!success) {
      setTitle(_title);
      setDescription(_description);
    } else {
      cardRef.current.setAttribute("_title", title);
      cardRef.current.setAttribute("_description", description);
    }
    const inputs = cardRef.current.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.classList.add("hidden");
      input.parentElement.querySelector("span").classList.remove("hidden");
    });
    document.getElementById(`editBTN-${id}`).classList.remove("hidden");

    document.getElementById(`saveBTN-${id}`).classList.add("hidden");
  };

  const editTitleDesc = () => {
    const inputs = cardRef.current.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.classList.remove("hidden");
      input.parentElement.querySelector("span").classList.add("hidden");
    });
    document.getElementById(`editBTN-${id}`).classList.add("hidden");

    document.getElementById(`saveBTN-${id}`).classList.remove("hidden");
  };

  return (
    <div
      ref={cardRef}
      id={id}
      className={`w-full h-52 rounded-md bg-${color}-600 bg-opacity-80 backdrop-brightness-200  hover:bg-opacity-100 hover:scale-[1.025] transition-all duration-300 flex flex-col justify-between text-white relative backdrop-blur-sm`}
    >
      <div className="h-5/6 overflow-clip px-3 pt-2">
        <h2 className="font-semibold text-xl mb-2">
          <span>{title}</span>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="focus:outline-none outline-none bg-transparent border-b-[1px] border-solid border-gray-500 focus:border-white transition-all duration-150 hidden placeholder:text-gray-300"
          />
        </h2>
        <p className="font-semibold text-wrap break-words overflow-y-auto h-48 scrollbar-invisible pb-20">
          <span >{description }</span>
          <textarea
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            rows={5}
            className="focus:outline-none outline-none bg-transparent border-b-[1px] border-solid border-gray-500 focus:border-white transition-all duration-150 hidden w-full placeholder:text-gray-300"
          />
        </p>
      </div>
      <div className="flex flex-row justify-end h-1/6 px-3 gap-8 bg-black bg-opacity-45 rounded-b-md">
        <button
          onClick={() => {
            delFunction(id);
          }}
        >
          {/* Delete Button */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5"
          >
            <path
              fillRule="evenodd"
              d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          onClick={async () => {
            let success = await favFunction(id, !isFavourite);
            if (success) {
              setIsFavourite(!isFavourite);
            }
          }}
        >
          {/* Star Button */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isFavourite ? "#FFD700" : "currentColor"}
            className="size-5"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button onClick={editTitleDesc} id={`editBTN-${id}`}>
          {/* Edit Button */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5"
          >
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
            <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
          </svg>
        </button>
        <button
          onClick={saveTitleDesc}
          id={`saveBTN-${id}`}
          className="hidden p-0"
        >
          {/* save Button */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-5"
          >
            <path
              fill-rule="evenodd"
              d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        {/* AI BUTTON */}
        <button
          onClick={() => {
            aiChatFunction(title + "|" + description);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-5"
          >
            <path
              fill-rule="evenodd"
              d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NoteDisplay;

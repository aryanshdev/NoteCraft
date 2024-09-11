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
  color,
}) => {
  const [title, setTitle] = useState(_title);
  const [description, setDescription] = useState(_description);
  const [isFavourite, setIsFavourite] = useState(isFav);

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
      className={`w-full h-52 rounded-md bg-${color}-600`}
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
        <p className="font-semibold text-wrap break-words">
          <span>{description}</span>
          <textarea
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            rows={4}
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

        <button>
          <Link to={"/notes/" + id} className="h-full my-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-5"
            >
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path
                fill-rule="evenodd"
                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                clip-rule="evenodd"
              />
            </svg>
          </Link>
        </button>
      </div>
    </div>
  );
};

export default NoteDisplay;

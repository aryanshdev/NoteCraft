import { useRef, useState, useEffect } from "react";
import React from "react";
import Icon from "./Icons";
import { tiltFor } from "../lib/utils";

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
      data-card
      style={tiltFor(id || _title)}
      className={`note paper-${color || "yellow"}`}
    >
      <div className="flex-1 overflow-hidden px-4 pt-5">
        <h2 className="note-title">
          <span>{title}</span>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="Title"
            className="note-input hidden"
          />
        </h2>
        <p className="note-text break-words overflow-y-auto h-36 scrollbar-invisible pb-6 whitespace-pre-line">
          <span>{description}</span>
          <textarea
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            rows={5}
            placeholder="Write something…"
            className="note-input hidden resize-none"
          />
        </p>
      </div>
      <div className="note-actions">
        <button
          title="Delete"
          aria-label="Delete note"
          onClick={() => {
            delFunction(id);
          }}
        >
          <Icon name="trash" />
        </button>
        <button
          title={isFavourite ? "Unstar" : "Star"}
          aria-label="Toggle favourite"
          onClick={async () => {
            let success = await favFunction(id, !isFavourite);
            if (success) {
              setIsFavourite(!isFavourite);
            }
          }}
        >
          <Icon name="star" filled={isFavourite} />
        </button>
        <button title="Edit" aria-label="Edit note" onClick={editTitleDesc} id={`editBTN-${id}`}>
          <Icon name="pencil" />
        </button>
        <button title="Save" aria-label="Save note" onClick={saveTitleDesc} id={`saveBTN-${id}`} className="hidden">
          <Icon name="check" strokeWidth={2.4} />
        </button>
        <button
          title="Ask NC-AI about this note"
          aria-label="Ask NC-AI about this note"
          onClick={() => {
            aiChatFunction(title + "|" + description);
          }}
        >
          <Icon name="at" />
        </button>
      </div>
    </div>
  );
};

export default NoteDisplay;

import { useRef, useState, useEffect } from "react";
import React from "react";
import Icon from "./Icons";
import { Link } from "react-router-dom";

const NoteGroupDisplay = ({
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
      data-card
      className={`folder paper-${color || "yellow"}`}
    >
      <div className="folder-tab" aria-hidden="true"></div>
      <div className="flex-1 overflow-hidden px-4 pt-4">
        <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-black/50">
          <span>Group</span>
          {isFavourite ? <Icon name="star" filled className="size-4 text-black/70" /> : null}
        </div>
        <h2 className="mb-1 text-2xl font-semibold leading-tight tracking-tight">
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
        <p className="note-text break-words overflow-y-auto h-28 scrollbar-invisible pb-4">
          <span>{description}</span>
          <textarea
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            rows={3}
            placeholder="What's this group for?"
            className="note-input hidden resize-none"
          />
        </p>
      </div>
      <div className="note-actions !pr-2 border-t border-black/10 pt-2">
        <button title="Delete" aria-label="Delete group" onClick={() => delFunction(id)}>
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
        <button title="Edit" aria-label="Edit group" onClick={editTitleDesc} id={`editBTN-${id}`}>
          <Icon name="pencil" />
        </button>
        <button title="Save" aria-label="Save group" onClick={saveTitleDesc} id={`saveBTN-${id}`} className="hidden">
          <Icon name="check" strokeWidth={2.4} />
        </button>
        <Link
          to={"/notes/" + id}
          className="ml-auto mr-0 inline-flex items-center gap-1.5 rounded-md bg-black/85 px-3 py-1.5 text-sm font-semibold text-[var(--paper)] hover:bg-black"
        >
          Open <Icon name="open" className="size-4" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
};

export default NoteGroupDisplay;

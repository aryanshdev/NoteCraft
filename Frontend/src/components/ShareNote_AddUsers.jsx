import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function editorDisplay(emailID, delEdFunction) {
  return (
    <>
      <div
        className="bg-[#4d4d4d] text-white font-semibold px-3 py-1 w-fit rounded-full flex flex-row gap-2 "
        key={emailID}
      >
        {" "}
        {emailID}
        <button
          onClick={() => {
            delEdFunction(emailID);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </>
  );
}

function ShareNote_AddUsers({ gid, closeFunction }) {
  const [link, setLink] = useState("");
  const [editors, setEditors] = useState([]);
  const navigate = useNavigate();
  const deleteEditor = (emailID) => {
    fetch("https://notecraftai-xct5.onrender.com/app/notesgroup/removeEditor", {
      credentials: "include",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailID,
        gid: gid,
      }),
    })
      .then((res) => {
        switch (res.status) {
          case 401:
            navigate("/401");
            return false;
          case 500:
            navigate("/500");
          case 200:
            toast.success("Editor Removed");
            console.log(editors);
            setEditors(editors.filter((ele) => ele != emailID));
            break;
        }

        return res.json();
      })
      .then((res) => {
        let url = `https://notecraft-ai.onrender.com/shared/${res["user"]}/${gid}`;
        setLink(url);
      });
  };
  useEffect(() => {
    fetch("https://notecraftai-xct5.onrender.com/app/notes/getSharingInfo", {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        let url = `https://notecraft-ai.onrender.com/shared/${res["user"]}/${gid}`;
        setLink(url);
      });
  }, []);

  useEffect(() => {
    fetch(
      `https://notecraftai-xct5.onrender.com/app/notesgroup/getEditors/${gid}`,
      { credentials: "include" }
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setEditors(res[0]["editors"] ? res[0]["editors"] : []);
      });
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    toast.info("Link Copied");
  };

  const addEditor = () => {
    fetch("https://notecraftai-xct5.onrender.com/app/notesgroup/addEditor", {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        email: document.querySelector("input[type='email']").value,
        gid: gid,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      switch (res.status) {
        case 401:
          navigate("/401");
          return false;
        case 500:
          navigate("/500");
        case 200:
          toast.success("Editor Added");
          setEditors((allEditors) => [
            ...allEditors,
            document.querySelector("input[type='email']").value,
          ]);
          break;
      }
    });
  };

  return (
    <>
      <div
        className="w-screen h-screen  justify-center align-middle items-center flex absolute bg-black bg-opacity-50 z-40 !hidden"
        id="shareOverlay"
      >
        <div className="bg-[#2e2e2e] rounded-xl px-4 py-2 z-30 absolute m-auto h-fit w-5/6 border-2 border-white md:h-fit md:w-1/2">
          <h2 className="text-2xl font-semibold">
            Share Notes And Allow Editors
          </h2>
          <div className="py-3">
            {" "}
            <h3 className="text-lg font-semibold">Share a View-Only Link </h3>
            <div className="flex flex-row h-auto w-full align-center items-center justify-around">
              <input
                type="text"
                readOnly
                className="outline-none w-full bg-[#404040] my-4 text-white px-3 py-2 rounded-full rounded-r-none"
                value={link}
              />
              <button
                className="rounded-l-none rounded-full px-3 py-2 bg-[#808080] flex flex-row gap-2"
                onClick={copyToClipboard}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6"
                >
                  <path
                    fill-rule="evenodd"
                    d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 0 1-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0 1 13.5 1.5H15a3 3 0 0 1 2.663 1.618ZM12 4.5A1.5 1.5 0 0 1 13.5 3H15a1.5 1.5 0 0 1 1.5 1.5H12Z"
                    clip-rule="evenodd"
                  />
                  <path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 0 1 9 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0 1 16.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625v-12Z" />
                  <path d="M10.5 10.5a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963 5.23 5.23 0 0 0-3.434-1.279h-1.875a.375.375 0 0 1-.375-.375V10.5Z" />
                </svg>
                Copy
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Editors</h3>
            Add Upto 3 Editors
            <div className="flex flex-row h-auto w-full align-center items-center justify-around">
              {editors.length < 3 ? (
                <>
                  <input
                    type="email"
                    className="outline-none w-full bg-[#404040] my-4 text-white px-3 py-2 rounded-full rounded-r-none"
                  />
                  <button
                    className="rounded-l-none rounded-full px-3 py-2 bg-[#808080] flex flex-row gap-2 align-middle items-center"
                    onClick={addEditor}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="size-5"
                    >
                      <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
                    </svg>
                    Add
                  </button>{" "}
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="flex flex-row w-full flex-wrap gap-3 pt-2 pb-4">
              <div className="flex-grow w-full">
                {editors.length + " Editor(s) Added"}
              </div>
              {editors.map((email, index) =>
                editorDisplay(email, deleteEditor)
              )}
            </div>
          </div>
          <button
            onClick={closeFunction}
            className="bg-white rounded-xl text-black px-3 py-1 font-semibold text-base"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}

export default ShareNote_AddUsers;

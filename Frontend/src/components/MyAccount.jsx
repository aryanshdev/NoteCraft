import { useCallback, useEffect, useState } from "react";
import Icon from "./Icons";
import { useNavigate } from "react-router-dom";
import LoaderDisplay from "../LoaderDisplay";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { use } from "react";

function ChangePFPPopup({ closePopup }) {
  const [showLoading, setShowLoading] = useState(false);
  const changeToGravatarImage = () => {
    setShowLoading(true);
    fetch("https://notecraftai-xct5.onrender.com/app/account/updateProfileImageGravatar", {
      credentials: "include",
      method: "PUT",
    }).then(async (res) => {
      switch (res.status) {
        case 200:
          document.getElementById("pfp").setAttribute("src", await res.text());
          toast.success("Using Gravatar Avatar");
          setShowLoading(false);
          closePopup();
          break;
        case 404:
          toast.warning("No Gravatar Account Found With Same Email");
          setShowLoading(false);
          break;
        case 401:
          navigate("/401");
          break;
      }
    });
  };
  const [file, setFile] = useState();

  // Destructure getRootProps and getInputProps from useDropzone
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      maxFiles: 1,
      accept: {
        "image/jpeg": [],
        "image/png": [],
      },
      onDrop: (acceptedFile) => {
        setShowLoading(true);
        if (acceptedFile.length == 0) toast.info("Only Image Files Allowed");
        else {
          setFile(acceptedFile[0]);
          const formData = new FormData();
          formData.append("image", acceptedFile[0]);
          fetch("https://notecraftai-xct5.onrender.com/app/account/updateProfileImageUpload", {
            credentials: "include",
            method: "PUT",
            body: formData,
          }).then(async (res) => {
            switch (res.status) {
              case 200:
                document
                  .getElementById("pfp")
                  .setAttribute("src", (await res.json())["url"]);
                toast.success("Profile Image Updated");
                setShowLoading(false);
                closePopup();
                break;
              case 401:
                navigate("/401");
                break;
              case 500:
                toast.error("Internal Server Error, Please Try Again Later");
                break;
            }
          });
        }
      },
    });

  useEffect(() => {
    document.title = "Account | NoteCraft";
  }, []);
  return (
    <>
      <div
        className="fixed w-screen h-screen top-0 left-0 bg-black/70 flex items-center justify-center !hidden z-[120] p-4"
        id="pfpUpdateOverlay"
      >
        <div className="relative flex flex-col md:flex-row p-6 md:p-8 w-full max-w-2xl z-50 panel gap-6 shadow-2xl">
          <div
            className="absolute right-3 top-3 grid h-8 w-8 cursor-pointer place-items-center rounded-md text-ink-300 hover:bg-white/5 hover:text-ink-100"
            onClick={closePopup}
          >
            <Icon name="x" className="size-5" />
          </div>
          {showLoading ? (
            <>
              <div className="mx-auto py-6"><LoaderDisplay label="Updating your photo…" /></div>
            </>
          ) : (
            <>
              <div className=" md:w-1/2 flex flex-col items-center gap-0 relative">
                <div className="w-full flex flex-col gap-10 my-auto text-center">
                  <span className="w-full">
                    <span className="eyebrow block mb-1">Option A</span>
                    <span className="text-lg font-semibold">Use your Gravatar</span>
                  </span>
                  <button
                    className="btn-paper m-auto"
                    onClick={changeToGravatarImage}
                  >
                    Use Gravatar Image
                  </button>
                </div>
                {/* OR
            <button
              className="hover:bg-white hover:text-black font-semibold border-2 w-auto px-4 py-2 rounded-lg m-auto "
              onClick={changeToGravatarImage}
            >
              Use Google Profile Image
            </button> */}
              </div>
              <div className="flex md:flex-col items-center gap-3 eyebrow"><span className="h-px w-full md:h-full md:w-px bg-ink-700"></span>or<span className="h-px w-full md:h-full md:w-px bg-ink-700"></span></div>
              <div className="w-full md:w-3/5 flex flex-col items-center justify-center text-center align-middle">
                <div
                  {...getRootProps()}
                  className="slot !h-auto min-h-48 items-center justify-center flex-col flex gap-2 cursor-pointer text-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-10"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                    />
                  </svg>
                  <input {...getInputProps()} />
                  <span className="font-semibold text-ink-100">Drop an image here</span>
                  <span className="text-sm">or click to choose a file</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
const showPFPChangeOptions = () => {
  document.getElementById("pfpUpdateOverlay").classList.toggle("!hidden");
};

function UserImage({ url }) {
  return (
    <>
      <div className="relative w-24">
        <img
          id="pfp"
          src={url}
          className="h-24 w-24 rounded-full object-cover ring-2 ring-ink-700"
          alt=""
        />
        <button
          className="absolute w-8 h-8 bg-marker right-0 rounded-full bottom-0 flex items-center justify-center border-2 border-ink-900 hover:brightness-110"
          onClick={showPFPChangeOptions}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="black"
            class="size-4"
          >
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
          </svg>
        </button>
      </div>
    </>
  );
}

function MyAccount() {
  const [userInfo, setuserInfo] = useState({});
  const [Loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://notecraftai-xct5.onrender.com/app/account/getInfo", {
      credentials: "include",
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
        if (res.status == 401) {
          toast.error("Session Expired, Please Login Again");
          return false;
        }
        setuserInfo(res);
        setLoading(false);
      });
  }, [navigate]);
  const resetAccount = async () => {
    const resetInnerFunc = async () => {
      await fetch("https://notecraftai-xct5.onrender.com/app/account/resetAccount", {
        credentials: "include",
        method: "DELETE",
      }).then((res) => {
        if (res.status == 200) {
          toast.success("Your Account Was Cleared");
        }
      });
    };

    var id = toast(
      <>
        <div>Confirm Reset?</div>
        <button
          className="btn-danger !py-1.5 my-2 text-sm"
          onClick={() => {
            resetInnerFunc();
            toast.dismiss(id);
          }}
        >
          Delete
        </button>
        <button
          className="btn-ghost !py-1.5 my-2 ml-3 text-sm"
          onClick={() => {
            toast.dismiss(id);
          }}
        >
          Cancel
        </button>
      </>
    );
  };
  const deleteAccount = async () => {
    const resetInnerFunc = async () => {
      await fetch("https://notecraftai-xct5.onrender.com/app/account/deleteAccount", {
        credentials: "include",
        method: "DELETE",
      }).then((res) => {
        switch (res.status) {
          case 200:
            toast.success("Your Account Was Deleted");
            setTimeout(navigate("/"), 2000);
            break;
          case 401:
            navigate("/401");
          case 500:
            navigate("/500");
        }
      });
    };

    var id = toast(
      <>
        <div>Confirm Account Deletion?</div>
        <button
          className="btn-danger !py-1.5 my-2 text-sm"
          onClick={() => {
            resetInnerFunc();
            toast.dismiss(id);
          }}
        >
          Delete
        </button>
        <button
          className="btn-ghost !py-1.5 my-2 ml-3 text-sm"
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
    return <LoaderDisplay label="Loading your account…" />;
  } else {
    return (
      <>
        <div className="mx-auto flex max-w-3xl flex-col gap-8 pb-16">
          <ChangePFPPopup closePopup={showPFPChangeOptions}></ChangePFPPopup>
          <header className="border-b border-ink-700 pb-5 pt-2">
            <p className="eyebrow mb-2">Settings</p>
            <h1 className="page-title">Your account</h1>
          </header>

          <section className="panel flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
            <UserImage url={userInfo.pfp}></UserImage>
            <div className="min-w-0">
              <h2 className="break-words text-2xl font-semibold">{userInfo.name}</h2>
              <p className="break-words font-mono text-sm text-ink-300">{userInfo.email}</p>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <p className="eyebrow text-red-300/80">Danger zone</p>
            <div className="panel divide-y divide-ink-700 border-red-400/25">
              <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-md">
                  <h4 className="font-semibold">Reset account</h4>
                  <p className="text-sm text-ink-300">
                    Deletes every note and note group, giving you a clean slate. Your login stays.
                  </p>
                </div>
                <button className="btn-danger shrink-0" onClick={resetAccount}>
                  Reset account
                </button>
              </div>
              <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-md">
                  <h4 className="font-semibold">Delete account</h4>
                  <p className="text-sm text-ink-300">
                    Removes all your data permanently. You'd need to sign up again to come back.
                  </p>
                </div>
                <button className="btn-danger shrink-0" onClick={deleteAccount}>
                  Delete account
                </button>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }
}

export default MyAccount;

import { useCallback, useEffect, useState } from "react";
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
        className="fixed w-screen  bg-black h-screen top-0 left-0 bg-opacity-50 backdrop-blur-sm backdrop-brightness-150 flex items-center align-middle justify-center !hidden z-[120]"
        id="pfpUpdateOverlay"
      >
        <div className="flex flex-col md:flex-row p-6 md:p-10 w-4/5 lg:w-1/2  h-auto z-50 bg-[#101010] rounded-xl gap-7 md:gap-1 absolute ">
          <div
            className="right-0 translate-x-3 -translate-y-4 absolute top-0 w-6 h-6  bg-white rounded-full flex align-middle items-center justify-center"
            onClick={closePopup}
          >
            <img
              width="15"
              height="15"
              src="https://img.icons8.com/ios-filled/20/000000/delete-sign--v1.png"
              alt="delete-sign--v1"
            />
          </div>
          {showLoading ? (
            <>
              <div className="w-20 h-20 border-2 border-white border-t-0 border-l-0 animate-spin rounded-full flex mx-auto abs"></div>
            </>
          ) : (
            <>
              <div className=" md:w-1/2 flex flex-col items-center gap-0 relative">
                <div className="w-full flex flex-col gap-10 my-auto text-center">
                  <span className="text-lg font-semibold w-full">
                    Use Gravatar Profile Image{" "}
                  </span>
                  <button
                    className="hover:bg-white hover:text-black font-semibold border-2 w-auto px-4 py-2 rounded-lg m-auto "
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
              <hr className="w-40 md:rotate-90 m-auto" />
              <div className="w-full md:w-3/5 flex flex-col items-center justify-center text-center align-middle">
                <div
                  {...getRootProps()}
                  className="w-full h-full p-6 border-dashed border-2 rounded-lg items-center justify-center flex-col flex gap-2 cursor-pointer*"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-20"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                    />
                  </svg>
                  <input {...getInputProps()} />
                  Drop Your Image Here To Upload
                  <br />
                  Or Click To Select Image
                </div>
              </div>
            </>
          )}
        </div>
        <button className="bg-white py-4 px-2 z[60]">Done</button>
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
          className="w-full rounded-full max-w-24 max-h-24"
          alt=""
        />
        <button
          className="absolute w-7 h-7 bg-white right-0 rounded-full bottom-0 flex items-center  justify-center opacity-85 hover:opacity-100 duration-150"
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
          className="bg-gray-800 py-2 my-2 px-3"
          onClick={() => {
            resetInnerFunc();
            toast.dismiss(id);
          }}
        >
          Delete
        </button>
        <button
          className="bg-gray-800 py-2 my-2 px-3 ml-7"
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
          className="bg-gray-800 py-2 my-2 px-3"
          onClick={() => {
            resetInnerFunc();
            toast.dismiss(id);
          }}
        >
          Delete
        </button>
        <button
          className="bg-gray-800 py-2 my-2 px-3 ml-7"
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
    return <LoaderDisplay />;
  } else {
    return (
      <>
        <div className="flex flex-col gap-6 ">
          <ChangePFPPopup closePopup={showPFPChangeOptions}></ChangePFPPopup>{" "}
          {/*  USER NAME DETAIL DISPLAY */}
          <div className="flex flex-row gap-3 py-2 ">
            <UserImage url={userInfo.pfp}></UserImage>
            <div className="flex flex-col justify-evenly">
              <h2 className="text-2xl font-semibold break-words">
                {userInfo.name}
              </h2>
              <h2 className="text-sm font-bold break-words">
                {userInfo.email}
              </h2>
            </div>
          </div>
          {/* Functions */}
          <div className="flex flex-col gap-3 items-start ">
            <h4 className="text-xl font-semibold">Reset Account</h4>
            Resetting Account will delete all your Notes and NoteGroups, giving
            you a fresh start.
            <button
              className="bg-red-600 text-white font-semibold px-4 py-2 rounded-md"
              onClick={resetAccount}
            >
              Reset Account
            </button>
          </div>
          <div className="flex flex-col gap-3 items-start">
            <h4 className="text-xl font-semibold">Delete Your Account </h4>
            Deleting Account will clear all your data and you won't be able to
            use NoteCraft. To use it again, you'll have to Sign-up again.
            <button
              className="bg-red-600 text-white font-semibold px-4 py-2 rounded-md"
              onClick={deleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default MyAccount;

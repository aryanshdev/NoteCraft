import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoaderDisplay from "../LoaderDisplay";
import { toast } from "react-toastify";
function MyAccount() {
  const [userInfo, setuserInfo] = useState({});
  const [Loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const changeToGravatarImage = () => {
    fetch("/app/account/updateProfileImage", {
      method: "PUT",
    }).then(async (res) => {
      switch (res.status) {
        case 200:
          document.getElementById("pfp").setAttribute("src", await res.text());
          toast.success("Using Gravatar Avatar");
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
  useEffect(() => {
    fetch("/app/account/getInfo")
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
      await fetch("/app/account/resetAccount", {
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
      await fetch("/app/account/deleteAccount", {
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
  if (Loading) {
    return <LoaderDisplay />;
  } else {
    return (
      <>
        <div className="flex flex-col gap-6 ">
          {" "}
          {/* USER NAME DETAIL DISPLAY */}
          <div className="flex flex-row gap-3 py-2">
            <img
              id="pfp"
              src={userInfo.pfp}
              className="w-1/3 rounded-full max-w-24 max-h-24"
              alt=""
            />
            <div className="flex flex-col justify-evenly">
              <h2 className="text-2xl font-semibold break-words">
                {userInfo.name}
              </h2>
              <h2 className="text-sm font-bold break-words">
                {userInfo.email}
              </h2>
            </div>
          </div>
          <button
            className="bg-white text-black w-auto px-3 py-1 rounded-lg mr-auto "
            onClick={changeToGravatarImage}
          >
            Change Profile Image
          </button>
          You Can Use Your Gravitar Account To Add Profile Photo
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

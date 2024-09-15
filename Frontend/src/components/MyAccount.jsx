import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoaderDisplay from "../LoaderDisplay";

function MyAccount() {
  const [userInfo, setuserInfo] = useState({});
  const [Loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("/app/account/getInfo")
      .then((res) => {
        if (res.status == 401) {
          navigate("/401");
          return false;
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
              src={userInfo.pfp}
              className="w-1/3 rounded-full max-w-20 max-h-20 "
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
          {/* Functions */}
          <div className="flex flex-col gap-3 items-start ">
            <h4 className="text-xl font-semibold">Reset Account</h4>
            Resetting Account will delete all your Notes and NoteGroups, giving you a fresh start.
            <button className="bg-red-600 text-white font-semibold px-4 py-2 rounded-md">
              Reset Account
            </button>
          </div>

          <div className="flex flex-col gap-3 items-start">
            <h4 className="text-xl font-semibold">Delete Your Account </h4> 
            Deleting Account will clear all your data and you won't be able to use NoteCraft. To use it again, you'll have to Sign-up again.
            <button className="bg-red-600 text-white font-semibold px-4 py-2 rounded-md">
              Delete Account
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default MyAccount;

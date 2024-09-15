import { ToastContainer, toast } from "react-toastify";
function Display404(fullScreen = false) {
  return (
    <>
      <div
        className={`${
          fullScreen ? "h-screen" : "h-full"
        } w-5/6 flex justify-center items-center gap-7 text-center flex-col text-xl  lg:text-2xl mx-auto`}
      >
        <h1 className="text-5xl font-semibold">
          404{" "}
          <span className="text-3xl block mt-2 text-red-500">Not Found</span>
        </h1>
        Resource You Are Looking For Was Not Found, Please Ensure You Are Trying
        To Access Correct Resource And Try Again
        <button className="bg-white px-4 py-2 text-xl  lg:text-2xl text-black font-semibold rounded-md">
          Return Home
        </button>
      </div>
    </>
  );
}

export default Display404;

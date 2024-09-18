import { Link } from "react-router-dom";

function Display500() {
  return (
    <>
      <div className="h-full w-5/6 flex justify-center items-center gap-7 text-center flex-col text-xl  lg:text-2xl mx-auto ">
        <h1 className="text-5xl font-semibold capitalize">
          500{" "}
          <span className="text-3xl block mt-2 text-red-500">Server Error</span>
        </h1>
       Oops!! I think the server Fell Asleep
        <Link to={"/"}>
        <button className="bg-white px-4 py-2 text-xl  lg:text-2xl text-black font-semibold rounded-md">
          Return Home
        </button>
        </Link>
      </div>
    </>
  );
}

export default Display500;
 
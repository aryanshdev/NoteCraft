import { Link } from "react-router-dom";

function Display401() {
  return (
    <>
      <div className="h-full w-5/6 flex justify-center items-center gap-7 text-center flex-col text-xl  lg:text-2xl mx-auto ">
        <h1 className="text-5xl font-semibold">
          401{" "}
          <span className="text-3xl block mt-2 text-red-500">Unauthorized</span>
        </h1>
        You Session Has Expired. Please Re-Login To Conitnue Using NoteCraft
        <Link to={"/login"}>
          <button className="bg-white px-4 py-2 text-xl  lg:text-2xl text-black font-semibold rounded-md">
            Login
          </button>
        </Link>
      </div>
    </>
  );
}

export default Display401;

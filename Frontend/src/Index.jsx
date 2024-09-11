import NoteGroupDisplay from "./components/NoteGroupDisplay";
import { Link } from "react-router-dom";

function Index() {
  return (
    <>
      <header className="h-auto fixed top-2 mx-auto flex w-screen justify-center">
        <div className="w-1/2 bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-full flex flex-row">
          <img></img>
          <ul className="flex flex-row gap-4 mr-0 ml-auto">
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="/Dashboard">Dashboard</a>
            </li>
          </ul>
        </div>
      </header>
      <section className="flex justify-center align-middle flex-col md:flex-row !w-screen h-screen overflow-hidden  relative ">
        <div className="bg-gradient-to-br w-56 h-56 from-yellow-500 to-gray-700 rounded-full absolute opacity-40 -z-20 top-0 left-1/2 blur-3xl overflow-hidden"></div>
        <div className="flex flex-col gap-2 justify-center align-middle h-[60vh] w-full md:w-2/3 p-5 md:px-10 md:py-16 md:h-full">
          <h1 className="text-4xl font-semibold w-full">NoteCraft</h1>
          <h3>AI Integrated Digital Sticky Notes!!</h3>
        </div>
        <div className="flex flex-col gap-2 justify-center align-middle h-[30vh] md:h-full !w-screen md:w-1/3 relative overflow-x-clip">
          <div className="absolute -rotate-6 z-[2] w-48">
            <NoteGroupDisplay
              isFav={true}
              _description="AGILE Methodology - Why We Need ? Where We Need?"
              _title="AGILE Notes"
              color={"blue"}
            ></NoteGroupDisplay>
          </div>

          <div className="absolute -right-2  z-[1] w-48 -rotate-6">
            <NoteGroupDisplay
              isFav={true}
              _description="NodeJS Notes - JS Basics, Async Await"
              _title="Learning NodeJS"
              color={"green"}
            ></NoteGroupDisplay>
          </div>
          <div className="absolute rotate-3 right-20 z-[1] w-48">
            <NoteGroupDisplay
              isFav={false}
              _description="My Personal Notes"
              _title="Important Notes"
              color={"orange"}
            ></NoteGroupDisplay>
          </div>
        </div>
      </section>
      <section className="flex justify-center py-20">
        <Link to="/login">
          <button className="bg-white rounded-sm px-4 py-2 text-black font-semibold m-auto">
            Get Started
          </button>
        </Link>
      </section>
    </>
  );
}

export default Index;

import NoteGroupDisplay from "./components/NoteGroupDisplay";
import { Link } from "react-router-dom";
import WordRotate from "./components/word-rotate";

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
      <section className="flex justify-center align-middle flex-col md:flex-row h-screen overflow-hidden  relative ">
        <div className="bg-gradient-to-br w-56 h-56 from-yellow-500 to-gray-700 rounded-full absolute opacity-40 -z-20 top-0 left-1/2 blur-3xl overflow-hidden"></div>
        <div className="flex flex-col gap-2 justify-center align-middle h-[60vh] w-full md:w-2/5 p-5 md:px-7 lg:px-10 md:py-16 md:h-full">
          <h1 className="text-4xl font-semibold w-full">NoteCraft</h1>
          <h3 className="flex flex-row align-middle items-center gap-2 text-xl">
            AI Integrated{" "}
            <WordRotate
              words={["Digital Notes.", "To-Do List.", "Planner."]}
            ></WordRotate>
          </h3>
        </div>
        <div className="flex flex-col gap-2 justify-center align-middle h-[30vh] md:h-full w-full md:w-3/5 relative ">
          <div className="absolute md:left-8  -rotate-6 z-[2] w-52">
            <NoteGroupDisplay
              isFav={true}
              _description="AGILE Methodology - Why We Need ? Where We Need?"
              _title="AGILE Notes"
              color={"blue"}
            ></NoteGroupDisplay>
          </div>

          <div className="absolute hidden lg:block md:right-44 xl:right-52 -rotate-6 z-[4] w-52">
            <NoteGroupDisplay
              isFav={false}
              _description="HTML Basics - CSS Basics - JS Basics - pHp Basics"
              _title="Web Dev Notes"
              color={"pink"}
            ></NoteGroupDisplay>
          </div>

          <div className="absolute hidden xl:block md:right-44 xl:left-56 -rotate-12 z-[3] w-52">
            <NoteGroupDisplay
              isFav={true}
              _description="HTML Basics - CSS Basics - JS Basics - pHp Basics"
              _title="Web Dev Notes"
              color={"green"}
            ></NoteGroupDisplay>
          </div>

          <div className="absolute hidden xl:block md:right-36 xl:left-80 rotate-6 z-[3] w-52">
            <NoteGroupDisplay
              isFav={true}
              _description="TOC-CD Basics, NFA-DFA, "
              _title="Theory Of Computation"
              color={"blue"}
            ></NoteGroupDisplay>
          </div>

          <div className="absolute hidden md:block md:-right-14 rotate-3 z-[1] w-52">
            <NoteGroupDisplay
              isFav={false}
              _description="HTML Basics - CSS Basics - JS Basics - pHp Basics"
              _title="Web Dev Notes"
              color={"yellow"}
            ></NoteGroupDisplay>
          </div>

          <div className="absolute -right-2 md:right-6 z-[1] w-52 -rotate-6">
            <NoteGroupDisplay
              isFav={false}
              _description="NodeJS Notes - JS Basics, Async Await"
              _title="Learning NodeJS"
              color={"green"}
            ></NoteGroupDisplay>
          </div>
          <div className="absolute rotate-3 right-16  md:left-32 z-[1] md:z-[2] w-52">
            <NoteGroupDisplay
              isFav={false}
              _description="To-Do For JAVA DSA - Basic, Intermediate and Advance DS and Basic Algorithms"
              _title="DSA To-Do"
              color={"orange"}
            ></NoteGroupDisplay>
          </div>
          <div className="absolute -rotate-12 md:right-14 left-32 z-[1] w-52 hidden md:visible">
            <NoteGroupDisplay
              isFav={false}
              _description="My Personal Notes"
              _title="Important Notes"
              color={"yellow"}
            ></NoteGroupDisplay>
          </div>
        </div>
      </section>
      <section className="flex justify-center py-20 px-5 text-xl flex-col gap-5">
        Being Your Note Making Journey
        <Link to="/login">
          <button className="bg-white rounded-md px-6 py-3 text-xl text-black font-semibold m-auto">
            Get Started
          </button>
        </Link>
      </section>
    </>
  );
}

export default Index;

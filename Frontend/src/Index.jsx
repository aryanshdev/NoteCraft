import NoteGroupDisplay from "./components/NoteGroupDisplay";
import { Link } from "react-router-dom";
import WordRotate from "./components/word-rotate";

function Index() {
  return (
    <>
      <header className="h-auto fixed top-2 mx-auto flex w-screen justify-center z-[100] flex-col">
        <div className="w-4/5 md:w-1/2 bg-gray-200 bg-opacity-10 backdrop-blur-lg px-4 py-2 rounded-full flex flex-row z-[100] align-middle items-center font-semibold text-lg mx-auto">
          <img
            src="./notecraft-icon-transparent.png"
            className="h-10 w-10 md:h-12 md:w-12 -mt-2 -mb-1 mr-2"
          ></img>
          NoteCraft
          <ul className="hidden md:flex flex-row gap-4 mr-0 ml-auto z-[100]">
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="/Dashboard">Dashboard</a>
            </li>
          </ul>
          <button onClick={()=>{
            document.getElementById("mobileMenu").classList.toggle("!hidden")
          }} className="ml-auto mr-1 md:hidden"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
          <path fill-rule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
        </svg>
        </button>
        </div>
        <div
          className="!hidden md:!hidden w-4/5 md:w-1/2 bg-gray-200 bg-opacity-10 backdrop-blur-lg px-4 py-2 rounded-b-3xl flex flex-row  align-middle items-center font-semibold text-lg mx-auto -mt-7 pt-10 z-[99] "
          id="mobileMenu"
        >
          <ul className="flex-col flex gap-6 text-center w-full z-[100]">
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="/login">Get Started</a>
            </li>
            <li>
              <a href="/Dashboard">Dashboard</a>
            </li>
          </ul>
        </div>
      </header>
      <section className="flex justify-center align-middle flex-col md:flex-row h-screen overflow-hidden  relative ">
        <div className="bg-gradient-to-br w-56 h-56 md:w-80 md:h-80 from-yellow-500 to-gray-700 rounded-full absolute opacity-40 -z-20 top-0 left-1/2 blur-3xl overflow-hidden md:right-14 md:left-auto"></div>
        <div className="flex flex-col gap-2 justify-center align-middle h-[60vh] w-full md:w-2/5 p-5 md:px-7 lg:px-10 md:py-16 md:h-full">
          <h1 className="text-4xl font-semibold w-full">NoteCraft</h1>
          <h3 className="flex flex-row align-middle items-center gap-2 text-2xl">
            AI Integrated{" "}
            <WordRotate
              duration={2000}
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
              color={"purple"}
            ></NoteGroupDisplay>
          </div>
          <div className="absolute left-1/4 md:hidden xs:hidden rotate-3 z-[1] w-52">
            <NoteGroupDisplay
              isFav={true}
              _description="What is React? Why is it used? Difference From Angular"
              _title="Dev Notes"
              color={"yellow"}
            ></NoteGroupDisplay>
          </div>
          <div className="absolute left-1/2 md:hidden xs:hidden -rotate-6 z-[0] w-52">
            <NoteGroupDisplay
              isFav={true}
              _description="What is C++? Why High Level Language? Uses and Implementations"
              _title="C++ Notes"
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
              color={"red"}
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
      <section
        className="flex justify-center py-20 px-5 text-xl flex-col gap-5"
        id="about"
      >
        <h2 className="text-3xl font-semibold"> What is NoteCraft?</h2>
        <p className="capitalize">
          NoteCraft is an{" "}
          <span className="font-bold italic">AI integrated</span> Note-Taking
          cum Planner app that helps you organize your ideas. Use Notecraft ad
          you want, as a study note taking platform, as a to-do planner, or as
          sticky notes that you can access fropm anywhere!!
        </p>
        <h2 className="text-3xl font-semibold"> Salient Features</h2>
        <div className="grid w-auto h-auto grid-flow-row md:grid-flow-col grid-cols-1 lg:grid-cols-3 gap-5 mx-3">
          <NoteGroupDisplay
            isFav={false}
            _description="Notecraft Makes It Much Easy To Manage You Ideas With A Very Simple and pleasing Interface and Experience"
            _title="Easy To Use"
            color={"green"}
          ></NoteGroupDisplay>
          <NoteGroupDisplay
            isFav={true}
            _description="Nodecraft-AI is the helper you need to conqure your goals. NC-AI helps, optemizes, and makes your life easier"
            _title="AI Integrated"
            color={"red"}
          ></NoteGroupDisplay>
          <NoteGroupDisplay
            isFav={false}
            _description="Collab With Others, Share Your Notes, and Work Together to achieve your goals"
            _title="Collab With Others"
            color={"blue"}
          ></NoteGroupDisplay>
        </div>
      </section>
      <section className="flex justify-center py-20 px-5 text-xl flex-col gap-5 text-center ">
        <span className="text-xl font-bold">
          Being Your Note Making Journey
        </span>
        <Link to="/login">
          <button className="bg-white rounded-md px-6 py-3 text-xl text-black font-semibold m-auto">
            Get Started
          </button>
        </Link>
      </section>
      <section className="text-center mb-10">
        &copy; 2024 NoteCraft. All rights reserved.
      </section>
    </>
  );
}

export default Index;

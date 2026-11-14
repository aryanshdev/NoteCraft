import "../style.css";
import { Link } from "react-router-dom";
import Icon from "./Icons";

function AppBar({ shareFunction, resetFunction }) {
  const showSideBar = () => {
    document.getElementById("sidebar").classList.toggle("-left-96");
  };

  const highlightItem = (target) => {
    target.classList.add("sidemenu-active");
  };
  const showChatSectionMobile = () => {
    document
      .getElementById("chatSectionContainer")
      .classList.toggle("-right-[100vw]");
  };

  const setAlertMode = () => {};

  return (
    <>
      <div className="flex flex-row h-screen w-fit m-0 p-0">
        <header className="fixed left-0 top-0 z-10 flex w-full items-center justify-between border-b border-ink-700 bg-ink-950/95 px-4 py-3 md:hidden">
          <button
            aria-controls="sidebar"
            type="button"
            onClick={showSideBar}
            className="grid h-9 w-9 place-items-center rounded-md text-ink-300 hover:bg-white/5"
          >
            <span className="sr-only">Open sidebar</span>
            <Icon name="menu" className="size-6" />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <img src="/notecraft-icon-transparent.png" alt="" className="h-7 w-7" />
            NoteCraft
          </Link>
          <button
            type="button"
            onClick={showChatSectionMobile}
            className="grid h-9 w-9 place-items-center rounded-md text-ink-300 hover:bg-white/5"
            aria-label="Open chat"
          >
            <Icon name="chat" className="size-6" />
          </button>
        </header>

        <aside
          id="sidebar"
          className="w-64 h-full md:h-screen md:relative -left-96 transition-all duration-300 md:block md:left-0 md:py-5 md:pl-5 md:pr-4 z-10 fixed"
        >
          <nav className="fixed md:relative flex h-full w-64 md:w-full flex-col gap-1 border-r border-ink-700 bg-ink-900 px-3 py-5 md:rounded-xl md:border">
            <div className="mb-6 flex items-center justify-between px-2">
              <Link to="/dashboard" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                <img src="/notecraft-icon-transparent.png" alt="" className="h-8 w-8" />
                NoteCraft
              </Link>
              <button onClick={showSideBar} className="md:hidden text-ink-300" aria-label="Close sidebar">
                <Icon name="x" className="size-6" />
              </button>
            </div>

            <Link to="/dashboard" className="nav-item">
              <Icon name="home" /> All groups
            </Link>

            <span className="eyebrow px-3 pb-1 pt-5">This group</span>
            <button
              className="nav-item"
              onClick={() => {
                document.getElementById("addNotButton").click();
                if (window.innerWidth < 768) showSideBar();
              }}
            >
              <Icon name="plus" /> New note
            </button>
            <button className="nav-item" onClick={shareFunction}>
              <Icon name="share" /> Share
            </button>
            <button className="nav-item hover:!text-red-300" onClick={resetFunction}>
              <Icon name="reset" /> Reset group
            </button>

            <div className="mt-auto border-t border-ink-700 pt-3">
              <Link to="/status" className="nav-item">
                <Icon name="status" /> Status
              </Link>
            </div>
          </nav>
        </aside>
      </div>
    </>
  );
}

export default AppBar;

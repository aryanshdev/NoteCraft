import { toast } from "react-toastify";
import "../style.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "./Icons";

function AppBar() {
  const nav = useNavigate();
  const showHideSideBar = () => {
    document.getElementById("sidebar").classList.toggle("-left-96");
  };

  const { pathname } = useLocation();
  const isActive = (path) => pathname.toLowerCase().startsWith(path);
  const closeOnMobile = () => {
    if (window.innerWidth < 768) showHideSideBar();
  };
  const logout = () => {
    fetch("https://notecraftai-xct5.onrender.com/auth/logout", {
      method: "POST",
      credentials: "include", // Necessary for cookies
    }).then((res) => {
      switch (res.status) {
        case 200:
          nav("/");
          break;
        case 500:
          toast.error("Something Went Wrong");
          break;
        case 401:
          nav("/");
          break;
      }
    });
  };

  return (
    <>
      <div className="flex flex-row h-screen w-fit m-0 p-0 z-[100] fixed md:static">
        <header className="fixed left-0 top-0 flex w-full items-center gap-3 border-b border-ink-700 bg-ink-950/95 px-4 py-3 md:hidden">
          <button
            aria-controls="sidebar"
            type="button"
            onClick={showHideSideBar}
            className="grid h-9 w-9 place-items-center rounded-md text-ink-300 hover:bg-white/5"
          >
            <span className="sr-only">Open sidebar</span>
            <Icon name="menu" className="size-6" />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <img src="/notecraft-icon-transparent.png" alt="" className="h-7 w-7" />
            NoteCraft
          </Link>
        </header>

        <aside
          id="sidebar"
          className="w-64 h-full md:h-screen md:relative -left-96 transition-all duration-300 md:block md:left-0 md:py-5 md:pl-5 md:pr-4 z-[100] absolute"
        >
          <nav className="absolute md:relative flex h-full w-64 md:w-full flex-col gap-1 border-r border-ink-700 bg-ink-900 px-3 py-5 md:rounded-xl md:border">
            <div className="mb-6 flex items-center justify-between px-2">
              <Link to="/dashboard" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                <img src="/notecraft-icon-transparent.png" alt="" className="h-8 w-8" />
                NoteCraft
              </Link>
              <button onClick={showHideSideBar} className="md:hidden text-ink-300" aria-label="Close sidebar">
                <Icon name="x" className="size-6" />
              </button>
            </div>

            <span className="eyebrow px-3 pb-1">Workspace</span>
            <Link
              to="/dashboard"
              className={`nav-item ${isActive("/dashboard") ? "sidemenu-active" : ""}`}
              onClick={closeOnMobile}
            >
              <Icon name="home" /> Dashboard
            </Link>
            <Link
              to="/account"
              className={`nav-item ${isActive("/account") ? "sidemenu-active" : ""}`}
              onClick={closeOnMobile}
            >
              <Icon name="user" /> Account
            </Link>

            <div className="mt-auto flex flex-col gap-1 border-t border-ink-700 pt-3">
              <button className="nav-item" onClick={() => nav("/status")}>
                <Icon name="status" /> Status
              </button>
              <button className="nav-item hover:!text-red-300" onClick={logout}>
                <Icon name="logout" /> Log out
              </button>
            </div>
          </nav>
        </aside>
      </div>
    </>
  );
}

export default AppBar;

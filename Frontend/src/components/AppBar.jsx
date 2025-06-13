import { toast } from "react-toastify";
import "../style.css";
import { Link, useNavigate } from "react-router-dom";

function AppBar() {
  const nav = useNavigate();
  const showHideSideBar = () => {
    document.getElementById("sidebar").classList.toggle("-left-96");
  };

  const clickOperation = (event) => {
    Array.from(event.target.parentNode.parentNode.children).forEach((ele) =>
      ele.firstElementChild.classList.remove("sidemenu-active")
    );
    event.target.classList.add("sidemenu-active");
    showHideSideBar();
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
      <div className="flex flex-row h-screen w-fit m-0 p-0 text-lg md:text-xl z-[100] fixed md:static">
        <header className=" bg-[#1b1b1b] h-auto fixed text-white text-black p-2 w-full md:hidden">
          <button
            data-drawer-target="default-sidebar"
            data-drawer-toggle="default-sidebar"
            aria-controls="default-sidebar"
            type="button"
            onClick={showHideSideBar}
            className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg md:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                fill-rule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              ></path>
            </svg>
          </button>
        </header>

        <aside
          id="sidebar"
          className="xl:w-[17.5vw] w-[25vw] md:w-fit h-full md:h-screen md:relative -left-96  transition-all duration-300 md:block md:left-0 md:py-5 md:px-6 z-[100] absolute min-w-fit"
        >
          <div className="absolute md:relative bg-[#121212] h-full flex flex-col  text-white backdrop-blur-xl py-8 px-4  md:rounded-3xl bg-opacity-75 md:w-full gap-2">
            <button onClick={showHideSideBar} className="md:hidden mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <button className="w-full text-left " >
              <Link
                to="/dashboard"
                className="w-full text-left p-2 my-4 flex flex-row gap-4 items-center sidemenu-active"
                onClick={clickOperation}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6"
                >
                  <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                  <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                </svg>
                Dashboard
              </Link>
            </button>
            <button className="w-full text-left" >
              <Link
                to="/account"
                className="w-full text-left p-2 my-4 flex flex-row gap-4 items-center "
                onClick={clickOperation}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                    clip-rule="evenodd"
                  />
                </svg>
                Account
              </Link>
              <div className="h-max w-auto flex-1"></div>
            </button>
            <button
              className="w-full text-left p-2 my-4 flex flex-row gap-4 items-center"
              onClick={logout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                stroke-width="2.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clip-rule="evenodd"
                />
              </svg>
              Logout
            </button>
            <button
              className="w-full text-left p-2 my-4 flex flex-row gap-4 items-center mt-auto -mb-2"
              onClick={()=>{nav("/status")}}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path d="M15.75 8.25a.75.75 0 0 1 .75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 1 1-.992-1.124A2.243 2.243 0 0 0 15 9a.75.75 0 0 1 .75-.75Z" />
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.575 15.6a8.25 8.25 0 0 0 9.348 4.425 1.966 1.966 0 0 0-1.84-1.275.983.983 0 0 1-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 0 1 2.328-.377L16.5 15h.628a2.25 2.25 0 0 1 1.983 1.186 8.25 8.25 0 0 0-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.575 15.6Z"
                  clip-rule="evenodd"
                />
              </svg>
              Status
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}

export default AppBar;

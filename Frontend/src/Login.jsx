import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PaperNote from "./components/PaperNote";

const deskNotes = [
  { title: "OAuth basics", body: "What is OAuth? Why do we need it? PassportJS strategies.", color: "purple", tilt: -4 },
  { title: "DSA to-do", body: "Arrays → linked lists → trees → graphs. One topic a day.", color: "orange", tilt: 3 },
  { title: "Learning Node", body: "Event loop, async/await, streams.", color: "green", tilt: -2 },
  { title: "Theory of Computation", body: "NFA vs DFA, minimisation, pumping lemma.", color: "blue", tilt: 5 },
  { title: "Groceries", body: "Milk, eggs, coffee (the good one), lemons.", color: "yellow", tilt: -6 },
  { title: "Web dev notes", body: "HTML basics · CSS grid · JS closures.", color: "pink", tilt: 2 },
];

function Spinner() {
  return <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950"></span>;
}

function Login() {
  const [showButtons, setShowButtons] = useState(false);
  const nav = useNavigate();
  useEffect(() => {
    document.title = "Login | NoteCraft";
    fetch("https://notecraftai-xct5.onrender.com/auth/check", {
      credentials: "include",
    }).then((res) => {
      switch (res.status) {
        case 200:
          nav("/dashboard");
          break;
        case 500:
          console.error("Something Went Wrong");
          break;
        case 401:
          setShowButtons(true);
          break;
      }
    });
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col md:flex-row">
      <div className="relative z-10 flex w-full flex-col justify-between gap-12 border-ink-700 bg-ink-950 px-6 py-8 md:w-[44%] md:border-r md:px-12 lg:px-16">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
          <img src="/notecraft-icon-transparent.png" alt="" className="h-9 w-9" />
          NoteCraft
        </Link>

        <div className="max-w-sm">
          <p className="eyebrow mb-3">Log in / Sign up</p>
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
            Your desk is <span className="marked">right where</span> you left it.
          </h1>
          <p className="mt-4 text-ink-300">
            One click with Google or GitHub. New here? The same button makes your account.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href={showButtons ? "/auth/google" : undefined}
              aria-disabled={!showButtons}
              className={`btn-paper w-full !justify-start !py-3 ${showButtons ? "" : "pointer-events-none opacity-80"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-6 w-6">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              <span className="flex-1 text-center">{showButtons ? "Continue with Google" : <Spinner />}</span>
            </a>
            <a
              href={showButtons ? "/auth/github" : undefined}
              aria-disabled={!showButtons}
              className={`btn-paper w-full !justify-start !py-3 ${showButtons ? "" : "pointer-events-none opacity-80"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.02c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
              </svg>
              <span className="flex-1 text-center">{showButtons ? "Continue with GitHub" : <Spinner />}</span>
            </a>
          </div>
        </div>

        <p className="text-sm text-ink-400">
          Trouble signing in? Check the{" "}
          <Link to="/status" className="underline decoration-ink-600 underline-offset-4 hover:text-ink-100">
            status page
          </Link>
          .
        </p>
      </div>

      {/* The desk */}
      <div className="relative hidden flex-1 overflow-hidden md:block" aria-hidden="true">
        <div className="absolute inset-0 grid grid-cols-2 gap-x-10 gap-y-14 p-14 lg:grid-cols-3 lg:p-16">
          {deskNotes.map((n, i) => (
            <PaperNote
              key={n.title}
              {...n}
              className={`self-start ${i % 2 ? "mt-10" : ""} ${i > 3 ? "hidden lg:flex" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Login;

// MainLayout.js
import { Outlet } from "react-router-dom";
import AppBar from "./components/AppBar"; 
import { ToastContainer } from "react-toastify";

const MainLayout = () => {
  return (<>
    <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
    transition:Bounce
  />
    <div className="flex flex-row">
      <AppBar />
      <div className="w-full h-screen py-5 px-4 md:pl-0 md:pr-4 mt-16 md:mt-0">
        <Outlet />
      </div>
    </div>
    </>
  );
};

export default MainLayout;

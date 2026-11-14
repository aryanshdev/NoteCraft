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
      <div className="w-full min-w-0 h-screen overflow-y-auto px-4 pb-5 pt-20 md:px-8 md:pt-6">
        <Outlet />
      </div>
    </div>
    </>
  );
};

export default MainLayout;

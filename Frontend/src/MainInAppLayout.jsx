// MainLayout.js
import { Outlet } from "react-router-dom";
import AppBar from "./components/AppBar"; // Assuming you have an AppBar component

const MainLayout = () => {
  return (
    <div className="flex flex-row">
      <AppBar />
      <div className="w-full h-screen py-5 px-4 md:pl-0 md:pr-4 mt-16 md:mt-0">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;

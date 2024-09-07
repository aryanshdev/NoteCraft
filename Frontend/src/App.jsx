import { useState } from "react";
import AppBar from "./components/AppBar";
import Dashboard from "./components/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyAccount from "./components/MyAccount";

function App() {
  const [openPage, setOpenPage] = useState("/");
  return (
    
      <Router>
       <div className="flex flex-row">
       <AppBar />
        <div className="w-full h-screen py-5 px-4 md:pl-0 md:pr-4 mt-16 md:mt-0">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/account" element={<MyAccount />} />
        </Routes>
        </div>
       </div>
      </Router>
    
  );
}

export default App;

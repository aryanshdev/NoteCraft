import { useState } from "react";
import AppBar from "./components/AppBar";
import Dashboard from "./components/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyAccount from "./components/MyAccount";
import Index from "./Index";
import MainLayout from "./MainInAppLayout";
import Login from "./Login";
import NotesPage from "./components/NotesPage";
import NoteGroupDisplay from "./components/NoteGroupDisplay";
import Display404 from "./Error Components/404";
import Display401 from "./Error Components/401";

function App() {
  return (
    <Router>
      <Routes>
        {/* Separate route for Home Page */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notes/:groupid" element={<NotesPage />} />

        {/* Routes with the MainLayout wrapper */}
        <Route element={<MainLayout />}>
          <Route path="/404" element={<Display404 />} />
          <Route path="/401" element={<Display401 />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account" element={<MyAccount />} />
        </Route>
        <Route path="*" element={<Display404 fullScreen={true}/>} />
      </Routes>
    </Router>
  );
}

export default App;

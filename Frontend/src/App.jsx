import { useState } from "react";
import AppBar from "./components/AppBar";
import Dashboard from "./components/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyAccount from "./components/MyAccount";
import Index from "./Index";
import MainLayout from "./MainInAppLayout";
import Login from "./Login";
import NotesPage from "./components/NotesPage";
import Display404 from "./Error Components/404";
import Display401 from "./Error Components/401";
import Display500 from "./Error Components/500";
import SharedNotes from "./components/SharedNotesView";
import StatusPage from "./components/StatusPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Separate route for Home Page */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notes/:groupID" element={<NotesPage />} />
        <Route path="shared/:userID/:groupID" element={<SharedNotes />} />
        <Route path="/status" element={<StatusPage />} />

        {/* Routes with the MainLayout wrapper */}
        <Route element={<MainLayout />}>
          <Route path="/500" element={<Display500 />} /> /
          <Route path="/404" element={<Display404 />} />
          <Route path="/401" element={<Display401 />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account" element={<MyAccount />} />
        </Route>
        <Route path="*" element={<Display404 fullScreen={true} />} />
      </Routes>
    </Router>
  );
}

export default App;

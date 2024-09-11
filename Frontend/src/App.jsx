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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account" element={<MyAccount />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

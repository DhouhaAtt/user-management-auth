import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserListPage from "./pages/users/UserListPage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<UserListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
}

export default App;

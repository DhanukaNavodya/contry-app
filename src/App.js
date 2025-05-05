// App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CountryDetails from "./components/CountryDetails";
import Favorites from "./pages/Favourite";
import Profile from "./pages/profile";

// Auth Provider
import { AuthProvider } from "./context/AuthContext";
import VerticalNav from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <VerticalNav />

          {/* Main Content Area */}
          <div style={{ flexGrow: 1, padding: "20px", marginLeft: "220px" }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={<PrivateRoute element={<Home />} />}
              />
              <Route
                path="/country/:name"
                element={<PrivateRoute element={<CountryDetails />} />}
              />
              <Route
                path="/favorites"
                element={<PrivateRoute element={<Favorites />} />}
              />
              <Route
                path="/profile"
                element={<PrivateRoute element={<Profile />} />}
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Overview from "./pages/Overview";
import Schedule from "./pages/Schedule";
import Patients from "./pages/Patients";
import Prescriptions from "./pages/Prescriptions";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register"; // Add this import
import Home from "./pages/Home"; // Add this import

// Protect dashboard routes
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/home" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route
          element={
            <PrivateRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 p-6 bg-gray-100 min-h-screen">
                  <Routes>
                    <Route path="/overview" element={<Overview />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/patients" element={<Patients />} />
                    <Route path="/prescriptions" element={<Prescriptions />} />
                    <Route path="/profile" element={<Profile />} />
                    {/* Redirect dashboard root to overview */}
                    <Route path="/" element={<Navigate to="/overview" />} />
                  </Routes>
                </div>
              </div>
            </PrivateRoute>
          }
        >
          <Route path="/*" />
        </Route>

        {/* Default route */}
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;

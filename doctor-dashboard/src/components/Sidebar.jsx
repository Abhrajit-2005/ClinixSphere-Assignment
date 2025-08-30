import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaUsers, FaFilePrescription, FaUserMd, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/home");
    };

    const menuItems = [
        { name: "Overview", icon: <FaHome />, path: "/overview" },
        { name: "Schedule", icon: <FaCalendarAlt />, path: "/schedule" },
        { name: "Patients", icon: <FaUsers />, path: "/patients" },
        { name: "Prescriptions", icon: <FaFilePrescription />, path: "/prescriptions" },
        { name: "Profile", icon: <FaUserMd />, path: "/profile" },
    ];

    return (
        <div className="h-screen w-64 bg-gray-900/90 backdrop-blur-md border-r border-gray-800 text-white flex flex-col justify-between p-6 sticky top-0 shadow-lg">
            <div>
                <h1 className="text-3xl font-bold mb-12 text-blue-400">Doctor Dashboard</h1>
                <nav className="flex flex-col gap-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 
                ${location.pathname === item.path ? "bg-blue-600 text-white" : "text-gray-200 hover:bg-gray-700 hover:text-blue-400"}`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Logout button */}
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 mt-6 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-300"
            >
                <FaSignOutAlt />
                Logout
            </button>
        </div>
    );
}

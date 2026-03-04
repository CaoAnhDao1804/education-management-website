import {Link} from "react-router-dom";
import { getUserRole } from "../utils/AuthUtils";

export default function Sidebar() {

    function isLoggedIn() {
        const accessToken = localStorage.getItem("accessToken");
        return accessToken !== null;
    }
    return (
        <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">

            {/* Menu */}
            {isLoggedIn() &&    
            <nav className="flex-1 p-2">
                <ul className="space-y-2">
                    <li>
                        {getUserRole() === "admin" && <a href="/course" className="block p-2 rounded hover:bg-gray-700 transition">
                            Course Management
                        </a>}
                    </li>
                    <li>
                        {getUserRole() === "admin" && <a href="/teacher" className="block p-2 rounded hover:bg-gray-700 transition">
                            Teacher Management
                        </a>}
                    </li>
                    <li>
                        {getUserRole() === "admin" && <a href="/student" className="block p-2 rounded hover:bg-gray-700 transition">
                            Student Management
                        </a>}
                    </li>
                    <li>
                        {getUserRole() === "admin" && <a href="/classes" className="block p-2 rounded hover:bg-gray-700 transition">
                            Class Management
                        </a>}
                    </li>
                    <li>
                        {getUserRole() === "admin" && <a href="#" className="block p-2 rounded hover:bg-gray-700 transition">
                            Settings
                        </a>}
                    </li>

                    <li>
                        {getUserRole() === "student" && <a href="/available-courses" className="block p-2 rounded hover:bg-gray-700 transition">
                            Available Courses
                        </a>}
                    </li>
                </ul>
            </nav>
            }
        </div>
    );
}
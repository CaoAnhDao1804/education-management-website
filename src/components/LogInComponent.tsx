import { useState } from "react";
import { getUserRole } from "../utils/AuthUtils";


export default function LogInComponent() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
        });
        if (!response.ok) {
            alert("Đăng nhập thất bại!");
            return;
        }
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        console.log("Đăng nhập thành công, token:", data.accessToken);
        alert("Quyền truy cập: " + getUserRole());
        window.location.href = "/";
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={(e) => e.preventDefault()}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm"
            >
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                    Đăng nhập ngay!
                </h2>

                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tên đăng nhập..."
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mật khẩu..."
                    />
                </div>

                <button
                    type="button"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={handleLogin}
                >
                    Login
                </button>
            </form>
        </div>
    );
}
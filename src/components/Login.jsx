import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [userName, setuserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // NEW
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // API_URL
    const API_URL = `${import.meta.env.VITE_API_URL}`;

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName, userEmail, password }),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.token);
                navigate("/", { state: { userName: userName } });
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-300">
            <form onSubmit={handleLogin}
                className="bg-white p-8 rounded-2xl shadow-2xl w-96 space-y-6">
                <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}

                <input
                    type="text"
                    placeholder="userName"
                    value={userName}
                    onChange={(e) => setuserName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
                <input
                    type="email"
                    placeholder="UserEmail"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"} // TOGGLE
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? (
                            // Eye Slash Icon
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.05 10.05 0 0 1 12 20c-7 0-11-8-11-8a19.64 19.64 0 0 1 5.06-6.94M1 1l22 22" />
                                <path d="M10.58 10.58a3 3 0 0 0 4.24 4.24" />
                            </svg>
                        ) : (
                            // Eye Icon
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>

                </div>

                <button
                    type="submit"
                    className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:from-purple-500 hover:to-blue-500 transition duration-300"
                >
                    Login
                </button>

                <p className="text-center text-gray-500">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-500 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
}

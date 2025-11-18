import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
    const [userName, setuserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // NEW
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // API_URL
    const API_URL = `${import.meta.env.VITE_API_URL}`;


    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(API_URL);
                const data = await res.json();

            } catch (error) {
                console.error("Failed to fetch data for login page:", error);
            }
        }
    }, [])


    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName, userEmail, password }),
            });
            const data = await res.json();
            if (res.ok) {
                navigate("/");
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 to-blue-300">
            <form onSubmit={handleSignup}
                className="bg-white p-8 rounded-2xl shadow-2xl w-96 space-y-6">
                <h2 className="text-3xl font-bold text-center text-gray-800">Create Account</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}

                <input
                    type="text"
                    placeholder="userName"
                    value={userName}
                    onChange={(e) => setuserName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full p-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-500 hover:to-green-500 transition duration-300"
                >
                    Sign Up
                </button>

                <p className="text-center text-gray-500">
                    Already have an account?{" "}
                    <Link to="/login" className="text-green-500 hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}

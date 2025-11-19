import { Link } from "react-router-dom";

export default function PreventAuth({ children }) {
    const token = localStorage.getItem("token");

    if (token) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
            <h1 className="text-3xl font-bold text-center">You are already logged in</h1>

            <Link to="/"
                className="inline-block bg-black text-white font-semibold rounded-xl px-4 py-2 whitespace-nowrap hover:bg-gray-800 transition-transform transform hover:scale-105">
                ⬅ Go Back to Dashboard
            </Link>
        </div>
    );

    return children;
}

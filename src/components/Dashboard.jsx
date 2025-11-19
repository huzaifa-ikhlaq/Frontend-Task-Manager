import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [boards, setBoards] = useState([]);
    const [newBoard, setNewBoard] = useState('');

    const userName = localStorage.getItem("userName") || "User";


    // token 
    const token = localStorage.getItem("token");

    const navigate = useNavigate();
    const API_URL = `${import.meta.env.VITE_API_URL}/boards`;

    useEffect(() => {
        fetch(API_URL, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setBoards(data);
                else console.error("Expected array, got:", data);
            })
            .catch((err) => console.error("Failed to fetch boards:", err));
    }, []);

    async function addBoard(e) {
        e.preventDefault();
        if (!newBoard.trim()) return alert('Please enter a board name!');

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: newBoard }),
            });
            const savedBoard = await res.json();
            setBoards([...boards, savedBoard]);
            setNewBoard('');
        } catch (err) {
            console.error("Failed to add board:", err);
        }
    }

    async function deleteBoard(id) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
            setBoards(boards.filter((b) => b._id !== id));
        } catch (err) {
            console.error("Failed to delete board:", err);
        }
    }

    const handleBoardClick = (boardId) => {
        const board = boards.find(b => b._id === boardId);
        navigate(`/board/${boardId}`, { state: { boardName: board.name } });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };


    return (
        <>
            <h1 className="bg-black text-white w-full text-3xl font-bold text-center rounded-b-4xl py-3 sticky top-0 z-10">
                Welcome, {userName} to Dashboard
            </h1>

            <div className="bg-gray-300 min-h-screen w-full px-4 sm:px-6 lg:px-12 py-6 flex justify-center">
                <div className="bg-white border border-gray-400 rounded-2xl w-full max-w-6xl flex flex-col gap-6 p-5">

                    {/* Input + Button */}
                    <form onSubmit={addBoard} className="flex flex-col sm:flex-row items-center gap-3 w-full">
                        <input
                            className="text-xl font-medium border border-gray-400 rounded-lg w-full sm:flex-1 h-10 p-2 px-3"
                            type="text"
                            placeholder="Enter board name..."
                            value={newBoard}
                            onChange={(e) => setNewBoard(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-black text-white font-semibold rounded-xl p-2 w-full sm:w-auto text-center whitespace-nowrap hover:bg-gray-800 transition transform hover:scale-102"
                        >
                            ➕ Add board
                        </button>
                    </form>

                    {/* Boards Display */}
                    {boards.length === 0 ? (
                        <p className="text-gray-500 text-xl text-center mt-10">No boards added yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full overflow-y-auto  ">
                            {boards.map((board) => (
                                <div
                                    key={board._id}
                                    onClick={() => handleBoardClick(board._id)}
                                    className="flex flex-col justify-between bg-gray-100 border border-gray-300 rounded-xl cursor-pointer p-4 sm:p-6 transition transform hover:bg-gray-200"
                                >
                                    <span className="font-medium text-2xl sm:text-3xl mb-4">{board.name} board</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteBoard(board._id); }}
                                        className="bg-black text-white px-3 py-1 rounded-lg hover:bg-red-600 transition transform hover:scale-102 w-full sm:w-auto text-center"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-between items-center  fixed bottom-5 right-5 ">
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition  cursor-pointer"> <span className='transition-all rotate-10'>➜]</span> Logout</button>
            </div>
        </>
    );
}

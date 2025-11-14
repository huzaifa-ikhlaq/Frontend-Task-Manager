import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";

export default function BoardDetail() {
    const location = useLocation();
    const boardName = location.state?.boardName || "Board Detail";
    const boardId = location.pathname.split('/board/')[1];
    const API_URL = `${import.meta.env.VITE_API_URL}/boards`;

    // Column states
    const [todoTasks, setTodoTasks] = useState([]);
    const [progressTasks, setProgressTasks] = useState([]);
    const [doneTasks, setDoneTasks] = useState([]);

    // Input states
    const [todoInput, setTodoInput] = useState('');
    const [progressInput, setProgressInput] = useState('');
    const [doneInput, setDoneInput] = useState('');

    // Edit states
    const [editingTask, setEditingTask] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [editingStatus, setEditingStatus] = useState('');


    // Fetch board tasks
    useEffect(() => {
        async function fetchBoardData() {
            try {
                const res = await fetch(`${API_URL}/${boardId}/tasks`);
                const data = await res.json();

                setTodoTasks(data.filter(task => task.status === 'todo') || []);
                setProgressTasks(data.filter(task => task.status === 'progress') || []);
                setDoneTasks(data.filter(task => task.status === 'done') || []);
            } catch (error) {
                console.error("Failed to fetch board data:", error);
            }
        }

        fetchBoardData();
    }, [boardId]);

    // Add task
    async function handleAddTask(e, status) {
        e.preventDefault();

        let input, setInput, setTasks, tasks;

        if (status === 'todo') {
            input = todoInput; setInput = setTodoInput; setTasks = setTodoTasks; tasks = todoTasks;
        } else if (status === 'progress') {
            input = progressInput; setInput = setProgressInput; setTasks = setProgressTasks; tasks = progressTasks;
        } else {
            input = doneInput; setInput = setDoneInput; setTasks = setDoneTasks; tasks = doneTasks;
        }

        if (!input.trim()) return;

        try {
            const res = await fetch(`${API_URL}/${boardId}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: input, status }),
            });
            const savedTask = await res.json();

            setTasks([...tasks, savedTask]);
            setInput('');
        } catch (error) {
            console.error("Failed to add task:", error);
        }
    }

    // Delete task
    async function handleDeleteTask(id, status) {
        try {
            await fetch(`${API_URL}/${boardId}/tasks/${id}`, { method: 'DELETE' });

            if (status === 'todo') setTodoTasks(todoTasks.filter(task => task._id !== id));
            else if (status === 'progress') setProgressTasks(progressTasks.filter(task => task._id !== id));
            else setDoneTasks(doneTasks.filter(task => task._id !== id));
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    }

    // Edit task
    const handleEditStart = (task, status) => {
        setEditingTask({ ...task, status });
        setEditingText(task.title);
        setEditingStatus(status);
    };



    async function handleEditSave() {
        if (!editingText.trim()) return;

        try {
            const res = await fetch(`${API_URL}/${boardId}/tasks/${editingTask._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editingText, status: editingStatus }),
            });
            const savedTask = await res.json();

            if (editingTask.status === editingStatus) {
                // same column — just replace
                if (editingStatus === 'todo') setTodoTasks(todoTasks.map(t => t._id === editingTask._id ? savedTask : t));
                else if (editingStatus === 'progress') setProgressTasks(progressTasks.map(t => t._id === editingTask._id ? savedTask : t));
                else setDoneTasks(doneTasks.map(t => t._id === editingTask._id ? savedTask : t));
            } else {
                // status changed — remove from old column
                if (editingTask.status === 'todo') setTodoTasks(todoTasks.filter(t => t._id !== editingTask._id));
                else if (editingTask.status === 'progress') setProgressTasks(progressTasks.filter(t => t._id !== editingTask._id));
                else setDoneTasks(doneTasks.filter(t => t._id !== editingTask._id));

                // add to new column
                if (editingStatus === 'todo') setTodoTasks([...todoTasks, savedTask]);
                else if (editingStatus === 'progress') setProgressTasks([...progressTasks, savedTask]);
                else setDoneTasks([...doneTasks, savedTask]);
            }


            setEditingTask(null);
            setEditingText('');
        } catch (error) {
            console.error("Failed to edit task:", error);
        }
    }

    const handleEditCancel = () => {
        setEditingTask(null);
        setEditingText('');
    };

    // Render column
    const renderColumn = (tasks, status, input, setInput) => (
        <div className="w-full sm:w-96 mb-6">
            <h2 className={`text-3xl font-bold text-center mb-4 ${status === 'todo' ? 'text-red-600' : status === 'progress' ? 'text-[#e7ad02]' : 'text-[#10b501]'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)} tasks
            </h2>
            <div className='bg-gray-200 rounded-xl p-4 w-full'>
                <form onSubmit={(e) => handleAddTask(e, status)} className="flex items-center justify-center gap-3 w-full flex-wrap">
                    <input
                        className="text-xl font-medium border border-gray-400 rounded-lg w-full sm:flex-1 h-10 p-2 px-3"
                        type="text"
                        placeholder={`Enter ${status} task`}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit" className="bg-black text-white font-semibold rounded-xl p-2 text-center whitespace-nowrap hover:bg-gray-800 transition cursor-pointer hover:scale-102 mt-2 sm:mt-0">
                        ➕ Add task
                    </button>
                </form>

                <div className="mt-5 h-60 overflow-y-auto">
                    {tasks.length === 0 ? (
                        <p className="text-gray-500 text-center mt-20">No tasks yet</p>
                    ) : (
                        <ul className="flex flex-col gap-2 mx-3">
                            {tasks.map(task => (
                                <li key={task._id} className="bg-white rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    {editingTask?._id === task._id && editingTask?.status === status ? (
                                        <div className="flex gap-2 w-full flex-wrap">
                                            <input className="border border-gray-400 rounded-lg p-1 w-full sm:flex-1"
                                                type="text"
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                            />
                                            <select value={editingStatus}
                                                onChange={(e) => setEditingStatus(e.target.value)}
                                                className="border border-gray-400 rounded-lg p-1">
                                                <option value="todo">To do</option>
                                                <option value="progress">In progress</option>
                                                <option value="done">Done</option>
                                            </select>

                                            <button onClick={handleEditSave} className="bg-green-600 text-white px-2 rounded-lg hover:bg-green-700">💾</button>
                                            <button onClick={handleEditCancel} className="bg-gray-400 text-white px-2 rounded-lg hover:bg-gray-500">✖</button>
                                        </div>
                                    ) : (
                                        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                            <span className="text-lg font-medium mb-2 sm:mb-0">{task.title}</span>
                                            <div className="flex gap-2 flex-wrap">
                                                <button onClick={() => handleEditStart(task, status)} className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 cursor-pointer">✏️ Edit</button>
                                                <button onClick={() => handleDeleteTask(task._id, status)} className="bg-black text-white px-3 py-1 rounded-lg hover:bg-red-600 cursor-pointer transition-all duration-300">🗑️</button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <h1 className="bg-black text-white w-full text-3xl font-bold text-center rounded-b-4xl py-3">
                {boardName} board details
            </h1>

            <div className='flex flex-wrap justify-center mt-16 gap-6 px-3'>
                {renderColumn(todoTasks, 'todo', todoInput, setTodoInput)}
                {renderColumn(progressTasks, 'progress', progressInput, setProgressInput)}
                {renderColumn(doneTasks, 'done', doneInput, setDoneInput)}
            </div>

            <div className="flex justify-center mt-10">
                <Link to="/" className="bg-black text-white font-semibold rounded-xl p-2 text-center whitespace-nowrap hover:bg-gray-800 transition cursor-pointer hover:scale-102">
                    ⬅ Go Back to Dashboard
                </Link>
            </div>
        </>
    );
}

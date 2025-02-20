import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { FaRegEdit } from "react-icons/fa";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const mail = user?.email;

    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Fetch tasks from backend
    useEffect(() => {
        if (mail) {
            fetch(`http://localhost:3000/tasks?mail=${mail}`)
                .then((res) => res.json())
                .then((data) => setTasks(data))
                .catch((error) => console.error("Error fetching tasks:", error));
        }
    }, [mail]);

    // Categorize tasks
    const categorizedTasks = {
        "To-Do": tasks.filter((task) => task.category === "To-Do"),
        "In Progress": tasks.filter((task) => task.category === "In Progress"),
        "Done": tasks.filter((task) => task.category === "Done"),
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const title = e.target.title.value;
        const description = e.target.description.value;
        const category = e.target.category.value;
        const timestamp = new Date().toISOString();

        const newTask = {
            mail,
            title,
            description,
            timestamp,
            category,
        };

        fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.insertedId) {
                    setTasks([...tasks, newTask]); // Update UI
                    closeModal();
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    if (!user) {
        return <div className="w-[60%] mx-auto py-48 text-center">Please log in to access the dashboard.</div>;
    }

    return (
        <div className="w-[85%] mx-auto py-5">
            {/* Add Task Button */}
            <button onClick={openModal} className="px-5 py-2 bg-blue-500 text-white mb-5 rounded">
                ADD
            </button>

            {/* Modal for adding a task */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white p-6 rounded-lg w-96 relative">
                            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl">
                                &times;
                            </button>

                            <h2 className="text-xl font-bold mb-4">Add New Task</h2>

                            <input type="text" placeholder="Title" name="title" className="w-full p-2 border rounded mb-3" required />

                            <textarea placeholder="Description" name="description" className="w-full p-2 border rounded mb-3" />

                            <select name="category" className="w-full p-2 border rounded mb-3">
                                <option value="To-Do">To-Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>

                            <div className="flex justify-end gap-2">
                                <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded">Add Task</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Task Categories */}
            <div className="flex gap-5 justify-center">
                {Object.entries(categorizedTasks).map(([category, tasks]) => (
                    <div key={category} className="w-80 bg-gray-200 p-2 rounded-lg">
                        <h2 className="text-xl font-bold">{category}</h2>
                        <div className="py-2">
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <div key={task._id} className="flex justify-between border border-gray-400 py-2 px-1 rounded-lg mb-2">
                                        <p>{task.title}</p>
                                        <button><FaRegEdit /></button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No tasks yet.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;

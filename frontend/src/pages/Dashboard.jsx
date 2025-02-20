import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const mail = user?.email;

    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setCurrentTask(null);
    };

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

    // Handle form submission (Add or Edit Task)
    const handleSubmit = (e) => {
        e.preventDefault();
        const title = e.target.title.value;
        const description = e.target.description.value;
        const category = e.target.category.value;
    
        if (isEditMode && currentTask) {
            // ✅ Update existing task in MongoDB
            fetch(`http://localhost:3000/tasks/${currentTask._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, category }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.modifiedCount > 0) {
                        // ✅ Update task in state (without reloading)
                        setTasks((prevTasks) =>
                            prevTasks.map((task) =>
                                task._id === currentTask._id ? { ...task, title, description, category } : task
                            )
                        );
                        closeModal();
                    }
                })
                .catch((error) => console.error("Error updating task:", error));
        } else {
            // ✅ Add new task
            const newTask = { mail, title, description, category };
    
            fetch("http://localhost:3000/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.insertedId) {
                        setTasks([...tasks, { ...newTask, _id: data.insertedId }]);
                        closeModal();
                    }
                })
                .catch((error) => console.error("Error:", error));
        }
    };    

    // ✅ Open Edit Modal
    const editTask = (task) => {
        setCurrentTask(task);
        setIsEditMode(true);
        openModal();
    };

    // ✅ Delete Task
    const deleteTask = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete task");
            }

            setTasks(tasks.filter((task) => task._id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    if (!user) {
        return <div className="w-[60%] mx-auto py-48 text-center">Please log in to access the dashboard.</div>;
    }

    return (
        <div className="w-[85%] mx-auto py-5">
            {/* Add Task Button */}
            <button onClick={openModal} className="px-5 py-2 bg-blue-500 text-white mb-5 rounded">
                {isEditMode ? "Update Task" : "ADD"}
            </button>

            {/* Modal for adding/editing a task */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white p-6 rounded-lg w-96 relative">
                            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl">
                                &times;
                            </button>

                            <h2 className="text-xl font-bold mb-4">{isEditMode ? "Edit Task" : "Add New Task"}</h2>

                            <input
                                type="text"
                                placeholder="Title"
                                name="title"
                                className="w-full p-2 border rounded mb-3"
                                defaultValue={isEditMode ? currentTask?.title : ""}
                                required
                            />

                            <textarea
                                placeholder="Description"
                                name="description"
                                className="w-full p-2 border rounded mb-3"
                                defaultValue={isEditMode ? currentTask?.description : ""}
                            />

                            <select name="category" className="w-full p-2 border rounded mb-3" defaultValue={isEditMode ? currentTask?.category : "To-Do"}>
                                <option value="To-Do">To-Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>

                            <div className="flex justify-end gap-2">
                                <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded">{isEditMode ? "Update Task" : "Add Task"}</button>
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
                                    <div key={task._id} className="border border-gray-400 py-2 px-1 rounded-lg mb-2">
                                        <div className="flex justify-between">
                                            <p className="text-lg font-bold">{task.title}</p>
                                            <div className="flex gap-2 items-center">
                                                <button onClick={() => editTask(task)}><FaRegEdit /></button>
                                                <button onClick={() => deleteTask(task._id)} className="text-red-500"><MdDelete /></button>
                                            </div>
                                        </div>
                                        <p>{task.description}</p>
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
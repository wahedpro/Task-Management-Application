import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";

const Dashboard = () => {

    const {user} = useContext(AuthContext);
    const mail = user.email;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Close modal when pressing "Escape"
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeModal();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const title = e.target.title.value;
        const description = e.target.description.value;
        const category = e.target.category.value;

        const newTask = {
            mail,
            title,
            description,
            category,
        };
        
        fetch('http://localhost:3000/addTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.insertedId) {
                    closeModal();
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        closeModal();
    };

    return (
        <div className="w-[85%] mx-auto py-5">
            {/* Add Task Button */}
            <button onClick={openModal} className="px-5 py-2 bg-blue-500 text-white mb-5 rounded">
                ADD
            </button>

            {/* Custom Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <form onSubmit={handleSubmit}>
                    <div className="bg-white p-6 rounded-lg w-96 relative">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
                        >
                            &times;
                        </button>

                        <h2 className="text-xl font-bold mb-4">Add New Task</h2>

                        {/* Title Input */}
                        <input
                            type="text"
                            placeholder="Title (max 50 chars)"
                            maxLength={50}
                            name="title"
                            className="w-full p-2 border rounded mb-3"
                            required
                        />

                        {/* Description Input */}
                        <textarea
                            placeholder="Description (max 200 chars)"
                            maxLength={200}
                            name="description"
                            className="w-full p-2 border rounded mb-3"
                        />

                        {/* Category Selection */}
                        <select
                            name="category"
                            className="w-full p-2 border rounded mb-3"
                        >
                            <option value="To-Do">To-Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>

                        {/* Buttons */}
                        <div className="flex justify-end gap-2">
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">
                                Cancel
                            </button>
                            <button  className="px-4 py-2 bg-blue-500 text-white rounded">
                                Add Task
                            </button>
                        </div>
                    </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

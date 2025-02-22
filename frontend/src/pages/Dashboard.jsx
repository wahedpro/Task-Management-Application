import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { NavLink } from "react-router-dom";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const mail = user?.email;

    const [tasks, setTasks] = useState({ "To-Do": [], "In Progress": [], "Done": [] });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("To-Do");

    // get the data who login
    useEffect(() => {
        if (mail) {
            fetch(`https://backend-mu-ochre-36.vercel.app/tasks?mail=${mail}`)
                .then((res) => res.json())
                .then((data) => {
                    const categorized = { "To-Do": [], "In Progress": [], "Done": [] };
                    data.forEach((task) => categorized[task.category].push(task));
                    setTasks(categorized);
                })
                .catch((error) => console.error("Error fetching tasks:", error));
        }
    }, [mail]);


    // Open Modal (For Add & Edit)
    const openModal = (task = null) => {
        setCurrentTask(task);
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setCategory(task.category);
        } else {
            setTitle("");
            setDescription("");
            setCategory("To-Do");
        }
        setIsModalOpen(true);
    };

    // Close Modal
    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTask(null);
    };

    //  Drag-and-Drop Functionality
    const onDragEnd = async (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceCategory = source.droppableId;
        const destCategory = destination.droppableId;

        const updatedTasks = { ...tasks };
        const [movedTask] = updatedTasks[sourceCategory].splice(source.index, 1);

        movedTask.category = destCategory;
        movedTask.order = destination.index; // Update Order

        updatedTasks[destCategory].splice(destination.index, 0, movedTask);
        setTasks(updatedTasks);

        try {
            await fetch(`https://backend-mu-ochre-36.vercel.app/updateTaskOrder/${movedTask._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category: destCategory, order: destination.index }),
            });
        } catch (error) {
            console.error("Error updating task order:", error);
        }
    };

    //  Handle Task Submission (Add & Edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newTask = { mail, title, description, category };

        if (currentTask) {
            //  Update Task in MongoDB
            const response = await fetch(`https://backend-mu-ochre-36.vercel.app/tasks/${currentTask._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            });

            if (response.ok) {
                setTasks((prevTasks) => {
                    const updatedTasks = { ...prevTasks };

                    //  Remove task from previous category
                    updatedTasks[currentTask.category] = updatedTasks[currentTask.category].filter(
                        (task) => task._id !== currentTask._id
                    );

                    //  Add updated task to new category
                    updatedTasks[category].push({ ...newTask, _id: currentTask._id });

                    return updatedTasks;
                });

                closeModal();
            }
        } else {
            //  Add New Task to MongoDB
            const response = await fetch("https://backend-mu-ochre-36.vercel.app/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            });

            const data = await response.json();
            if (data.insertedId) {
                setTasks((prevTasks) => ({
                    ...prevTasks,
                    [category]: [...prevTasks[category], { ...newTask, _id: data.insertedId }],
                }));
                closeModal();
            }
        }
    };

    //  Delete Task
    const deleteTask = async (id, category) => {
        try {
            const response = await fetch(`https://backend-mu-ochre-36.vercel.app/tasks/${id}`, { method: "DELETE" });
            if (response.ok) {
                setTasks((prevTasks) => ({
                    ...prevTasks,
                    [category]: prevTasks[category].filter((task) => task._id !== id),
                }));
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    if(!mail) return <div className="py-48 text-center">
        <p className="pb-5 text-xl">You must log in to Access.</p>
        <NavLink to='/login' className="px-5 py-2 bg-blue-500 hover:bg-blue-400 text-white">Login</NavLink>
    
    </div>

    return (
        <div className="w-[95%] mx-auto py-24">
            <button onClick={() => openModal()} className="px-5 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-700">
                + Add Task
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">{currentTask ? "Edit Task" : "Add New Task"}</h2>

                        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded mb-3" required />

                        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded mb-3" required/>

                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded mb-3">
                            <option value="To-Do">To-Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>

                        <div className="flex justify-end gap-2">
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md">{currentTask ? "Update Task" : "Add Task"}</button>
                        </div>
                    </form>
                </div>
            )}

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="w-[95%] mx-auto lg:flex gap-5 justify-between mt-5 space-y-5">
                    {Object.keys(tasks).map((category) => (
                        <Droppable key={category} droppableId={category}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="lg:w-[50%] bg-gray-100 p-4 rounded-lg shadow-lg min-h-[300px]">
                                    <h2 className="text-xl font-semibold mb-3">{category}</h2>
                                    {tasks[category].map((task, index) => (
                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-white p-3 rounded-md shadow-sm flex flex-col gap-1 mb-2">
                                                    <p className="font-bold text-gray-800">{task.title}</p>
                                                    <p className="text-sm text-gray-600">{task.description}</p>
                                                    <div className="flex justify-end gap-2 mt-2">
                                                        <button onClick={() => openModal(task)} className="text-blue-500"><FaRegEdit /></button>
                                                        <button onClick={() => deleteTask(task._id, category)} className="text-red-500"><MdDelete /></button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default Dashboard;
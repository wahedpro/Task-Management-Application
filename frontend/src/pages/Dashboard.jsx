import { BsThreeDots } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";


const Dashboard = () => {
    return (
        <div className="w-[85%] mx-auto py-5">
            <div className="flex">
                <div className="mr-3 w-60 h-fit rounded-md p-2 bg-gray-200">
                    <div className="flex justify-between items-center pb-3">
                        <h1 className="font-bold">To Do</h1>
                        <BsThreeDots size={20}/>
                    </div>
                    <div className="flex justify-between items-center py-2 border px-1 rounded-xl border-gray-400">
                        <p>write notes here</p>
                        <button><FaRegEdit /></button>
                    </div>
                </div>
                <div className="mr-3 w-60 h-fit rounded-md p-2 bg-gray-200">
                    <div className="flex justify-between items-center pb-3">
                        <h1 className="font-bold">In Progress</h1>
                        <BsThreeDots size={20}/>
                    </div>
                    <div className="flex justify-between items-center py-2 border px-1 rounded-xl border-gray-400">
                        <p>write notes here</p>
                        <button><FaRegEdit /></button>
                    </div>
                </div>
                <div className="mr-3 w-60 h-fit rounded-md p-2 bg-gray-200">
                    <div className="flex justify-between items-center pb-3">
                        <h1 className="font-bold">Done</h1>
                        <BsThreeDots size={20}/>
                    </div>
                    <div className="flex justify-between items-center py-2 border px-1 rounded-xl border-gray-400">
                        <p>write notes here</p>
                        <button><FaRegEdit /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
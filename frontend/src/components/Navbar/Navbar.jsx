import { useContext } from "react";
import { Navigate, NavLink } from "react-router-dom";
import { AuthContext } from "../../provider/AuthProvider";

const Navbar = () => {

    const {user, logoutUser} = useContext(AuthContext);


    const handleLogout = () => {
        logoutUser()
            .then(() => {
                Navigate("/");
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    };

    return (
        <div className="w-[96%] mx-auto py-5 flex justify-between border items-center">
            <NavLink to='/'>Task Management Application</NavLink>
            <div>
            {
                user ? <div className="flex gap-2 items-center">
                    <img
                className="w-10 h-10 rounded-full cursor-pointer border border-gray-200"
                src={user.photoURL}
                alt="User Profile"
                title={user.displayName}/>
                <button
                                onClick={() => {
                                    handleLogout();
                                }}
                                className="px-4 py-2 text-white bg-[#6666F2] rounded hover:bg-[#6666F2] transition"
                            >
                                Logout
                            </button>
                </div> 
                : 
                <NavLink to="/login" className="py-2 px-7 bg-blue-500 text-white">Login</NavLink>
            }
            </div>
        </div>
    );
};

export default Navbar;
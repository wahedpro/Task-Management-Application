import { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const { loginWithGoogle } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const googleLogin = async () => {
        setLoading(true);
        try {
            await loginWithGoogle();
            console.log("Logged in with Google!");
            navigate("/");
        } catch (err) {
            console.error(err.message || "Google login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-[50%] mx-auto flex flex-col items-center py-52">
            <button
                onClick={googleLogin}
                disabled={loading}
                className="text-white py-2 px-7 bg-blue-500 hover:bg-blue-400 transition "
            >
                {loading ? "Logging in..." : "Login with Google"}
            </button>
        </div>
    );
};

export default LoginPage;
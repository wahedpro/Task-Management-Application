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
        <div className="w-[50%] mx-auto flex flex-col items-center">
            <button
                onClick={googleLogin}
                disabled={loading}
                className="text-white bg-[#6666F2] px-4 py-2 hover:bg-[#5757d8] transition disabled:opacity-50"
            >
                {loading ? "Logging in..." : "Login with Google"}
            </button>
        </div>
    );
};

export default LoginPage;

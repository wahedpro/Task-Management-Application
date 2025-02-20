import { createContext, useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut, updateProfile, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase.init";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
    const googleAuthProvider = new GoogleAuthProvider();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            console.log(currentUser)
            setLoading(false);
        });
        return () => unsubscribe(); 
    }, []);

    const loginWithGoogle = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleAuthProvider);
            setUser(result.user); 
        } catch (error) {
            console.error("Google Login Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const manageProfile = (name, images) => {
        if (!auth.currentUser) return Promise.reject("No user logged in");
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: images,
        });
    };

    const logoutUser = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null); 
        } catch (error) {
            console.error("Logout Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Loading state while authentication is processing
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#0048B0]"></div>
            </div>
        );
    }

    const authInfo = {
        user,
        setUser,
        logoutUser,
        loginWithGoogle,
        manageProfile,
        loading,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
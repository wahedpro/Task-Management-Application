import { FaSquareFacebook, FaYoutube } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";


const Footer = () => {
    return (
        <div className="bg-gray-100 py-2">
            <div className="w-[80%] mx-auto flex flex-col items-center gap-2">
                <p className="text-center">© Task Management System. All rights reserved.</p>
                <div className="flex gap-3">
                    <FaSquareFacebook size={25} />
                    <FaLinkedin size={25} />
                    <FaYoutube size={25} />
                </div>
            </div>
        </div>
    );
};

export default Footer;
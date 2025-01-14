import React, { useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { IoMdClose } from "react-icons/io"

const Toast = ({ message, type = "success", duration = 3000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer); // Cleanup timer
    }, [duration, onClose]);

    const typeStyles = {
        success: "bg-teal-100 text-teal-600 border-teal-600",
        error: "bg-primary-2 text-primary-1 border-primary-1",
    };

    const icon = {
        success: <FaCheck className="text-teal-600 text-header-2" />,
        error: <IoMdClose className="text-primary-1 text-header-1" />,
    };

    return (
        <div className={`fixed top-4 right-4 z-50 p-4 w-80 rounded-lg shadow-lg border-l-4 bg-opacity-80 font-medium
                flex items-center gap-4 animate-fade-up transition-transform transform ${typeStyles[type]}`}
        >
            {icon[type]}
            {message}
        </div>
    );
};

export default Toast;

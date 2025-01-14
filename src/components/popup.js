import React, { useEffect } from "react";
import Button from "./button";

const Popup = ({ title, text, isOpen, onClose, onConfirm }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        // Dọn dẹp khi component bị hủy
        return () => {
            document.body.style.overflow = "auto";

        };
    }, [isOpen]);

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            onClick={onClose} // Đóng popup khi nhấn ra ngoài
        >
            <div
                className="bg-white rounded-lg shadow-lg p-6 w-96 "
                style={{ zIndex: 1000 }}
                onClick={(e) => e.stopPropagation()} // Ngăn sự kiện lan vào overlay
            >
                <h2 className="text-lg font-bold text-neutral-1-900 text-center mb-4">{title}</h2>
                <p className="text-gray-600 text-center mb-6">{text}</p>
                <div className="flex justify-end space-x-4">
                    <Button
                        width={'w-1/2'}
                        height={'h-12'}
                        text={'Không'}
                        textSize={'text-body-1'}
                        textColor={'text-primary-1'}
                        bgColor={'bg-white'}
                        border={'border-2 border-primary-1'}
                        onClick={onClose}
                    />
                    <Button
                        width={'w-1/2'}
                        height={'h-12'}
                        text={'Có'}
                        textSize={'text-body-1'}
                        textColor={'text-white'}
                        bgColor={'bg-primary-1'}
                        onClick={onConfirm}
                    />
                </div>
            </div>
        </div>
    );
};

export default Popup;

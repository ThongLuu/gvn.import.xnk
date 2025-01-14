import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io"

import Toast from "../components/Toast";
import Loader from "../components/loader";

import QuotationServices from '../services/quotation.services';

const SharePopup = ({ sharePopupOpen, setSharePopupOpen, selectedProducts }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    senderEmail: "",
    receiverEmail: "",
    ccEmail: "",
    content: "",
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (sharePopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Dọn dẹp khi component bị hủy
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sharePopupOpen]);

  const validate = () => {
    const newErrors = {};

    if (!formData.senderEmail) {
      newErrors.senderEmail = "Email người gửi là bắt buộc.";
    } else if (!/\S+@\S+\.\S+/.test(formData.senderEmail)) {
      newErrors.senderEmail = "Email không hợp lệ.";
    }

    if (!formData.receiverEmail) {
      newErrors.receiverEmail = "Email người nhận là bắt buộc.";
    } else if (!/\S+@\S+\.\S+/.test(formData.receiverEmail)) {
      newErrors.receiverEmail = "Email không hợp lệ.";
    }

    if (formData.ccEmail && !/\S+@\S+\.\S+/.test(formData.ccEmail)) {
      newErrors.ccEmail = "Email không hợp lệ.";
    }

    if (!formData.content) {
      newErrors.content = "Nội dung là bắt buộc.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const renderFormInput = (required, label, placeholder, type, name) => {
    return (
      <div className="mb-4 flex items-center">
        <label className="block text-neutral-1-900 font-bold mb-2 w-36 xl:w-48" htmlFor={name}>
          {label} {required && <span className="text-primary-1">*</span>}
        </label>

        <div className="flex-1 flex flex-col">
          <input
            type={type}
            id={name}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder={placeholder}
          />
          {errors[name] && (
            <p className="text-primary-1 text-sm mt-1">{errors[name]}</p>
          )}
        </div>

      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // handleQuotation()

      // call API email

      setToast({
        message: "Chia sẻ qua Email thành công !",
        type: "success"
      })
    }
  };

  const handleShareFb = async () => {
    const result = await createQuotation()

    if (result.err) {
      setToast({
        message: result.err.message,
        type: "error"
      })
    }
    else {
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        `http://localhost:3000/pages/export-build-pc?id=${result}`
      )}`;
      window.open(facebookShareUrl, "_blank", "noopener,noreferrer");

    }
  };

  const createQuotation = async () => {
    const transformed = selectedProducts.reduce((acc, item) => {
      if (!acc.category) {
        acc.category = {};
      }

      if (!acc.category[item.category_id]) {
        acc.category[item.category_id] = { ...item }; // Copy all attributes from the item
        acc.category[item.category_id].quantity = 0;  // Initialize quantity
      }

      acc.category[item.category_id].quantity += item.quantity;

      return acc;
    }, {});

    setIsLoading(true);

    try {
      const response = await QuotationServices.createQuotation(transformed);
      return response.id

    } catch (error) {
      console.log(`Lỗi lưu báo giá`, error)
      return { err: error }

    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      {isLoading && <Loader />}
      {toast &&
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      }

      <div className="fixed inset-0 bg-black bg-opacity-50"></div>

      <div className="absolute bottom-0 left-0 w-full overflow-y-auto bg-white rounded-lg top-0 xl:top-auto xl:bottom-auto xl:left-auto xl:max-h-[650px] xl:max-w-[1200px]">

        <div className="flex items-center justify-between w-full bg-neutral-2-50 border-b border-neutral-1-100 py-4 px-3">
          <div className="font-bold text-neutral-1-900 text-header-2 xl:text-header-1">Chia sẻ qua Email</div>
          <IoMdClose onClick={() => setSharePopupOpen(false)}
            className="cursor-pointer text-heading-3 font-bold text-neutral-1-700 hover:text-neutral-900" />
        </div>

        <form
          className="bg-white mx-6 py-6 border-b border-neutral-1-400 text-body-2 xl:text-body-1"
          onSubmit={handleSubmit}
        >
          {renderFormInput(false, "Họ tên", "Nhập họ tên", "text", "fullName")}
          {renderFormInput(true, "Email người gửi", "Nhập email người gửi", "email", "senderEmail")}
          {renderFormInput(true, "Email người nhận", "Nhập email người nhận", "email", "receiverEmail")}
          {renderFormInput(false, "CC Email", "Nhập email CC", "email", "ccEmail")}

          <div className="mb-4 flex items-start">
            <label className="block text-neutral-1-900 font-bold mb-2 text-body-2 w-36 xl:text-body-1 xl:w-48" htmlFor="content">
              Nội dung <span className="text-red-500">(*)</span>
            </label>

            <div className="flex-1 flex flex-col">
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 h-24"
                placeholder="Nhập nội dung email"
              ></textarea>
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
            </div>

          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="py-2 px-4 mx-auto bg-primary-1 text-white font-bold rounded-md  hover:brightness-90 transition"
            >
              Gửi email
            </button>
          </div>

        </form>

        <div className="p-3 pb-6 flex flex-col gap-3 items-center justify-center">
          <div className="font-bold text-neutral-1-900 text-header-2 xl:text-header-1">Chia sẻ qua Facebook</div>
          <button
            onClick={handleShareFb}
            className="flex items-center px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all 
                    text-white font-bold text-body-2 xl:text-body-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5 mr-2"
            >
              <path d="M22.675 0h-21.35C.598 0 0 .593 0 1.326v21.348C0 23.408.592 24 1.325 24h11.495v-9.294H9.692V11.41h3.128V8.842c0-3.1 1.892-4.787 4.657-4.787 1.325 0 2.465.099 2.796.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.763v2.312h3.588l-.467 3.297h-3.121V24h6.116C23.408 24 24 23.408 24 22.675V1.326C24 .592 23.408 0 22.675 0z" />
            </svg>
            Share on Facebook
          </button>
        </div>
      </div>
    </div>

  );
}

export default SharePopup

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AutoComplete from "../../../components/AutoComplete";
import PreviewProductItemsTable from "./PreviewProductItemsTable";

const ModelForm = ({ isUpdate, data }) => {
  const [formData, setFormData] = useState(data);

  const suggestions = [
    "Apple",
    "Banana",
    "Orange",
    "Pineapple",
    "Grape",
    "Strawberry",
    "Mango",
  ];

  const navigator = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectProductName = (productName) => {
    setFormData({
      ...formData,
      productName, // Cập nhật giá trị productName khi người dùng chọn gợi ý
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-40 font-medium">Model name</div>
            <div className="flex-grow">
              <input
                type="text"
                id="modelName"
                name="modelName"
                placeholder="Model name"
                value={formData.modelName}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-md w-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="w-40 font-medium">Product name</div>
            <div className="flex-grow">
              <AutoComplete
                id="productName"
                name="productName"
                placeholder="Product name"
                suggestions={suggestions}
                onSelect={handleSelectProductName} // Truyền hàm onSelect vào đây
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="w-40 font-medium">Query</div>
            <div className="flex-grow">
              <textarea
                id="query"
                name="query"
                rows="4"
                placeholder="Query"
                value={formData.query}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-md w-full"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 mr-2 bg-white text-black rounded-md border border-inherit focus:outline-none"
              onClick={() => navigator("/models")}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 mr-2 bg-white text-black rounded-md border border-inherit focus:outline-none"
            >
              Preview
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Create
            </button>
          </div>
        </form>
      </div>
      <div>
        <div className="border-solid border-gray-300 border-b pb-2 font-semibold">
          O Product Items
        </div>
        <PreviewProductItemsTable data={[]} />
      </div>
    </div>
  );
};

export default ModelForm;

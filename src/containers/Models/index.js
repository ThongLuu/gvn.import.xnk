import React, { useState } from "react";

const Models = () => {
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);

  // Dữ liệu mẫu
  const totalRows = 69204;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const data = Array.from({ length: rowsPerPage }, (_, i) => ({
    model: `Model ${i + 1 + (currentPage - 1) * rowsPerPage}`,
    productLine: `Product Line ${i + 1}`,
    brand: `Brand ${i + 1}`,
    query: `Query ${i + 1}`,
  }));

  // Xử lý thay đổi số lượng hàng mỗi trang
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  // Xử lý chuyển trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Hàm hiển thị nút phân trang
  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const half = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - half);
    let endPage = Math.min(totalPages, currentPage + half);

    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <>
        {currentPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700"
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700"
            >
              &lt;
            </button>
          </>
        )}
        {pageNumbers}
        {currentPage < totalPages && (
          <>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700"
            >
              &gt;
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700"
            >
              Last
            </button>
          </>
        )}
      </>
    );
  };

  return (
    <div className="p-4">
      {/* Thanh tìm kiếm và nút */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 p-2 rounded-md w-1/3"
        />
        <div className="flex items-center space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            + Create Model
          </button>
          <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md">
            Filter
          </button>
        </div>
      </div>

      {/* Bảng */}
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-4 py-2">Model</th>
            <th className="border border-gray-200 px-4 py-2">Product Line</th>
            <th className="border border-gray-200 px-4 py-2">Brand</th>
            <th className="border border-gray-200 px-4 py-2">Query</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-200 px-4 py-2">{row.model}</td>
              <td className="border border-gray-200 px-4 py-2">
                {row.productLine}
              </td>
              <td className="border border-gray-200 px-4 py-2">{row.brand}</td>
              <td className="border border-gray-200 px-4 py-2">{row.query}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <label className="mr-2">Rows per page:</label>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="border border-gray-300 p-2 rounded-md"
          >
            <option value={30}>30</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="flex items-center">{renderPagination()}</div>
        <div>Total Models: {totalRows}</div>
      </div>
    </div>
  );
};

export default Models;

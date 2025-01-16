import React from "react";

const PreviewProductItemsTable = ({ data }) => {
  return data.length > 0 ? (
    <div>
      <table>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-200 px-4 py-2">
                {row.productName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="font-semibold text-gray-400 text-center">No Item Found</div>
  );
};

export default PreviewProductItemsTable;

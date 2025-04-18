// ui/Table.js
import React from 'react';

function Table({ data, columns }) {
  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className="px-4 py-2 border-b bg-gray-100 text-left text-sm font-medium text-gray-700"
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item._id} className="hover:bg-gray-50">
            {columns.map((col) => (
              <td key={col.key} className="px-4 py-2 border-t text-sm text-gray-800">
                {col.render ? col.render(item) : item[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;

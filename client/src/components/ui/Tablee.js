import React from 'react';

const Table = ({ data, columns }) => {
  return (
    <table className="min-w-full table-auto border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th key={col.header} className="px-4 py-2 text-left border-b">{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row._id} className="hover:bg-gray-50">
            {columns.map((col) => (
              <td key={col.accessor} className="px-4 py-2 border-b">
                {col.render
                  ? col.render(row) // custom render for actions etc.
                  : col.format
                  ? col.format(row[col.accessor])
                  : row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;

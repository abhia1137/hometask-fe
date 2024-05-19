import React from "react";

function formatColumnName(str) {
  return str
    .replace(/([A-Z])/g, " $1") 
    .replace(/^./, (char) => char.toUpperCase()); 
}
const DataTable = ({ data }) => {
  const isObject = (val) => typeof val === "object" && val !== null;
  const isArray = (val) => Array.isArray(val);

  
  const normalizedData = isArray(data) ? data : [data];

  
  if (
    !normalizedData ||
    !isArray(normalizedData) ||
    normalizedData.length === 0
  ) {
    return <div>No data available</div>;
  }

  
  const columns = Object.keys(normalizedData[0]);

  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{formatColumnName(col)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {normalizedData.map((row, index) => (
          <tr key={index}>
            {columns.map((col) => (
              <td key={col}>
                {isObject(row[col]) ? (
                  <DataTable data={row[col]} />
                ) : isArray(row[col]) ? (
                  row[col].map((item, idx) => (
                    <div key={idx}>
                      {isObject(item) ? <DataTable data={item} /> : item}
                    </div>
                  ))
                ) : (
                  row[col]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;

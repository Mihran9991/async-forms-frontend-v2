import React from "react";

function Row({ properties }) {
  const formattedProperties = Object.values(properties);

  return (
    <tr>
      {formattedProperties.map((name, idx) => (
        <td key={`${name}_${idx}`}>{name}</td>
      ))}
    </tr>
  );
}

export default Row;

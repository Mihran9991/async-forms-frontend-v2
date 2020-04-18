import React from "react";
import Row from "./Row";

function Body({ rows, deleteRowHandler }) {
  return (
    <tbody>
      {rows.map((properties, idx) => (
        <Row
          key={`row_${idx}`}
          properties={properties}
          deleteRowHandler={() => deleteRowHandler(idx)}
        />
      ))}
    </tbody>
  );
}

export default Body;

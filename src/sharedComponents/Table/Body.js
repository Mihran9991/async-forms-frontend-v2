import React from "react";
import Row from "./Row";

function Body({ rows, deleteRowHandler, editRowHandler }) {
  return (
    <tbody>
      {rows.map((properties, idx) => (
        <Row
          key={`row_${idx}`}
          properties={properties}
          deleteRowHandler={() => deleteRowHandler(idx)}
          editRowHandler={(editedData) => editRowHandler(idx, editedData)}
        />
      ))}
    </tbody>
  );
}

export default Body;

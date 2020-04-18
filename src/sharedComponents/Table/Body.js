import React from "react";
import Row from "./Row";

function Body({ rows }) {
  return (
    <tbody>
      {rows.map((properties, idx) => (
        <Row key={`row_${idx}`} properties={properties} />
      ))}
    </tbody>
  );
}

export default Body;

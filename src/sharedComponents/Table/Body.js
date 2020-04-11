import React from "react";
import Row from "./Row";

function Body({ data }) {
  return (
    <tbody>
      {data.map((properties, idx) => (
        <Row key={`row_${idx}`} properties={properties} />
      ))}
    </tbody>
  );
}

export default Body;

import React from "react";
import Column from "./Column";

function Header({ data }) {
  return (
    <thead>
      <tr>
        {/* <Column name={"#"} /> */}
        {data.map(({ name }, idx) => {
          return <Column key={`col_${idx}`} name={name} />;
        })}
      </tr>
    </thead>
  );
}

export default Header;

import React from "react";
import Column from "./Column";

function Header({ columns }) {
  return (
    <thead>
      <tr>
        {/* <Column name={"#"} /> */}
        {Object.keys(columns).map((name, idx) => {
          return <Column key={`col_${idx}`} name={name} />;
        })}
      </tr>
    </thead>
  );
}

export default Header;

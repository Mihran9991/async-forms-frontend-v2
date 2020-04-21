import React from "react";

import { transformObjectDataIntoArray } from "../../utils/dataTransformUtil";
import Column from "./Column";

function Header({
  columns,
  editable,
  editColumnHandler,
  deleteColumnByNameHandler,
}) {
  const transformedColumns = transformObjectDataIntoArray(columns, "entries");

  return (
    <thead>
      <tr>
        {/* <Column name={"#"} /> */}
        {transformedColumns.map(([name, { type }], idx) => {
          return (
            <Column
              key={`col_${idx}`}
              name={name}
              type={type}
              editable={editable}
              editColumnHandler={editColumnHandler}
              deleteColumnByNameHandler={deleteColumnByNameHandler}
              maxWidth={100 / transformedColumns.length}
            />
          );
        })}
      </tr>
    </thead>
  );
}

export default Header;

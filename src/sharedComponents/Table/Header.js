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
        {transformedColumns.map(([name, properties], idx) => {
          return (
            <Column
              key={`col_${idx}`}
              name={name}
              properties={properties}
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

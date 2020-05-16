import React from "react";

import Column from "../../Form/Column";
import get from "lodash/get";

function Title({
  editColumnHandler,
  deleteColumnByNameHandler,
  saveStructureHandler,
  name,
  editable,
  type,
  uid,
  data,
}) {
  return (
    <Column
      name={name}
      propName={name}
      editColumnHandler={(editedData) => {
        editColumnHandler(name, uid, editedData);
      }}
      deleteColumnByNameHandler={deleteColumnByNameHandler}
      saveStructureHandler={saveStructureHandler}
      editable={editable}
      type={get(type, "name", "") || type || ""}
      values={data}
    />
  );
}
export default Title;

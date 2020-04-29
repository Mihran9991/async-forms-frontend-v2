import React from "react";

import Column from "../../Form/Column";

function Title({
  editColumnHandler,
  deleteColumnByNameHandler,
  saveStructureHandler,
  name,
  editable,
  type,
  uid,
  data,
  structure,
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
      type={type.name || ""}
      values={data}
    />
  );
}
export default Title;

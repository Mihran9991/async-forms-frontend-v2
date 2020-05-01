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
}) {
  // console.log("Title DD DATA", data);

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
      type={type.name || type || ""}
      values={data}
    />
  );
}
export default Title;

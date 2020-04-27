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
  return (
    <Column
      name={name}
      propName={name}
      editColumnHandler={(editedData) => {
        console.log("constuctoin data", editedData);

        editColumnHandler(name, uid, editedData);
      }}
      deleteColumnByNameHandler={deleteColumnByNameHandler}
      editable={editable}
      type={type.name || ""}
      values={data}
      saveStructureHandler={saveStructureHandler}
    />
  );
}
export default Title;

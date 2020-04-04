import React, { useState } from "react";

function TextInput() {
  const [value, setValue] = useState("");

  const onChangeHandler = ({ target: { value } }) => {
    setValue(value);
  };

  return (
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        onChange={onChangeHandler}
        value={value}
      />
    </div>
  );
}

export default TextInput;

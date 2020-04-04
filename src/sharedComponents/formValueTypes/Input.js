import React, { useState } from "react";

function TextInput({ type }) {
  const [value, setValue] = useState("");

  const onChangeHandler = ({ target: { value } }) => {
    setValue(value);
  };

  return (
    <div className="input-group">
      <input
        type={type}
        className="form-control"
        onChange={onChangeHandler}
        value={value}
      />
    </div>
  );
}

export default TextInput;

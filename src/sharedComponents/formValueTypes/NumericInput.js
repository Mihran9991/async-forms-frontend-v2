import React, { useState } from "react";

function NumericInput() {
  const [value, setValue] = useState(0);

  const onChangeHandler = ({ target: { value } }) => {
    setValue(value);
  };

  return (
    <div className="input-group">
      <input
        type="number"
        className="form-control"
        onChange={onChangeHandler}
        value={value}
      />
    </div>
  );
}

export default NumericInput;

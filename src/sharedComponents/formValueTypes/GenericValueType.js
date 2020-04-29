import React, { useState, useEffect } from "react";
import { If, Then } from "react-if";
import { Button } from "antd";

import Input from "./Input";
import ComponentByType from "./ComponentByType";
import { validateField } from "../../utils/formUtil";
import { INPUT } from "../../constants/formConstants";

function GenericFieldType({
  type,
  uid,
  removeHandler,
  saveStructure,
  setAreAllFieldsValid,
  forInstance,
  value,
}) {
  const [name, setName] = useState("");
  const [oldName, setOldName] = useState(name);
  const [structure, setStructure] = useState({});
  const [error, setError] = useState("");

  const structureBuilder = (data) => {
    setStructure({ ...structure, ...data });
  };

  const currentValue = () => {
    if (type === INPUT) {
      return name;
    }

    return structure;
  };

  const saveStructureHandler = () => {
    const value = currentValue();
    const isValid = validateField(value, type);

    if (!name.length || !isValid) {
      setError("Please provide valid data");
      setAreAllFieldsValid(false);
      return;
    }

    setError("");
    saveStructure({ value, type, name, oldName });
    setAreAllFieldsValid(Boolean(isValid));
    setOldName(name);
  };

  useEffect(() => {
    setAreAllFieldsValid(false);
  }, []);

  return (
    <div key={uid} style={{ marginBottom: 10, marginTop: 10 }}>
      <If condition={!Boolean(forInstance)}>
        <Then>
          <div className="main-text" style={{ marginBottom: 5 }}>
            <b>{type}</b>
          </div>
          <If condition={type !== INPUT}>
            <Then>
              <Input
                style={{ marginBottom: 10 }}
                onBlurHandler={saveStructureHandler}
                cb={setName}
                callbackResponseOnlyValue
                placeholder={"Type field name"}
              />
              <br />
            </Then>
          </If>
        </Then>
      </If>
      <ComponentByType
        type={type}
        name={name}
        structureBuilder={!forInstance ? structureBuilder : () => {}}
        setName={setName}
        saveStructureHandler={!forInstance ? saveStructureHandler : () => {}}
        structure={structure}
        error={error}
        forInstance={Boolean(forInstance)}
        value={value}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <br />
      <If condition={!Boolean(forInstance)}>
        <Then>
          <Button
            style={{ marginTop: 10 }}
            onClick={() => {
              removeHandler(uid, name);
              setAreAllFieldsValid(true);
            }}
            type="danger"
          >
            Remove
          </Button>
        </Then>
      </If>
    </div>
  );
}

export default GenericFieldType;

// eslint-disable-next-line no-lone-blocks
{
  /* && isEditing */
}
// eslint-disable-next-line no-lone-blocks
{
  /* <If condition={name.length > 0}>
          <Then>
            <Button
              onClick={saveStructureHandler}
              type="primary"
              style={{ marginRight: 5 }}
            >
              Save
            </Button>
          </Then>
        </If> */
}

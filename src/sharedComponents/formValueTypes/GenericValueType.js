import React, { useState, useEffect } from "react";
import { If, Then } from "react-if";
import { Button, notification } from "antd";

import Input from "./Input";
import { GetComponentByType } from "../../utils/commonUtil";
import { validateField } from "../../utils/formUtil";

import { INPUT } from "../../constants/formConstants";

function GenericFieldType({
  type,
  uid,
  removeHandler,
  saveStructure,
  setAreAllFieldsValid,
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
    saveStructure({ value: value, type, name, oldName });
    setAreAllFieldsValid(Boolean(isValid));
    setOldName(name);
  };

  useEffect(() => {
    setAreAllFieldsValid(false);
  }, []);

  return (
    <div key={uid} style={{ marginBottom: 10, marginTop: 10 }}>
      <div className="main-text" style={{ marginBottom: 5 }}>
        <b>{type}</b>
      </div>
      <If condition={type !== INPUT}>
        <Then>
          <Input
            style={{ marginBottom: 10 }}
            onBlurHandler={() => {
              saveStructureHandler();
            }}
            cb={setName}
            callbackResponseOnlyValue
            placeholder={"Type field name"}
          />
          <br />
        </Then>
      </If>
      <GetComponentByType
        type={type}
        name={name}
        structureBuilder={structureBuilder}
        setName={setName}
        saveStructureHandler={saveStructureHandler}
        structure={structure}
        error={error}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <br />
      {/* && isEditing */}
      {/* <If condition={name.length > 0}>
          <Then>
            <Button
              onClick={saveStructureHandler}
              type="primary"
              style={{ marginRight: 5 }}
            >
              Save
            </Button>
          </Then>
        </If> */}
      <Button
        style={{ marginTop: 10 }}
        onClick={() => removeHandler(uid, name)}
        type="danger"
      >
        Remove
      </Button>
    </div>
  );
}

export default GenericFieldType;

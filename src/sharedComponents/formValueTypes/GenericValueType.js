import React, { useState, useEffect } from "react";
import { If, Then } from "react-if";
import { Button, notification } from "antd";

import Input from "./Input";
import { getComponentByType } from "../../utils/commonUtil";
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

  const structureBuilder = (data) => {
    setStructure({ ...structure, ...data });
  };

  const openNotification = (placement) => {
    notification.info({
      message: `Invalid field`,
      description: "Please provide valid field properties",
      placement,
    });
  };

  const currentValue = () => {
    if (type === INPUT) {
      return name;
    }

    return structure;
  };

  const saveStructureHandler = () => {
    console.log("saveStructureHandler");
    const value = currentValue();
    const isValid = validateField(value, type);

    if (!name.length || !isValid) {
      openNotification("topRight");
      setAreAllFieldsValid(false);
      return;
    }

    saveStructure({ value: value, type, name, oldName });
    setAreAllFieldsValid(isValid);
    setOldName(name);
  };

  const [component, withName] = getComponentByType({
    type,
    name,
    structureBuilder,
    setName,
    saveStructureHandler,
  });

  useEffect(() => {
    setAreAllFieldsValid(false);
  }, []);

  return (
    <div key={uid} style={{ marginBottom: 10, marginTop: 10 }}>
      <div className="main-text" style={{ marginBottom: 5 }}>
        <b>{type}</b>
      </div>
      <If condition={withName}>
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
      {component}
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
        onClick={() => removeHandler(uid)}
        type="danger"
      >
        Remove
      </Button>
    </div>
  );
}

export default GenericFieldType;

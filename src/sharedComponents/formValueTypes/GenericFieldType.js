import React, { useState, useEffect } from "react";
import { If, Then } from "react-if";
import { Button } from "antd";

import Input from "./Input";
import ComponentByType from "./ComponentByType";
import { validateField } from "../../utils/formUtil";
import { INPUT, TABLE, DROP_DOWN } from "../../constants/formConstants";
import { transformObjectDataIntoArray } from "../../utils/dataTransformUtil";

function GenericFieldType({
  type,
  componentId,
  removeHandler,
  saveStructure,
  setAreAllFieldsValid,
  forInstance,
  forStructure,
  initialStrucutre = {},
  value,
  duplicateAvailable,
  name: nameFromProps,
  valueId,
  isDuplicate,
  instanceId,
  formId,
  title,
  fieldId,
}) {
  const [name, setName] = useState(nameFromProps || "");
  const [structure, setStructure] = useState(initialStrucutre);
  const [error, setError] = useState("");
  const isValid = validateField(structure, type, name);

  const structureBuilder = (data) => {
    const structureCopy = { ...structure };

    structureCopy.valueId = valueId;
    if (structure.name === DROP_DOWN) {
      structureCopy.values = transformObjectDataIntoArray(data, "values")[0];
      setStructure({ ...structureCopy });
      return;
    }

    if (structure.name === TABLE) {
      structureCopy.fields = transformObjectDataIntoArray(data, "values")[0];
      setStructure({ ...structureCopy });
      return;
    }

    setStructure({ ...structureCopy, ...data });
  };

  const saveStructureHandler = () => {
    if (!name.length || !isValid) {
      if (type !== INPUT) {
        saveStructure({
          type,
          value: structure,
          name,
          valueId,
          forComplicatedType: true,
          isDuplicate,
        });
      }
      setError("Please provide valid data");
      setAreAllFieldsValid(false);
      return;
    }

    setError("");
    setAreAllFieldsValid(Boolean(isValid));
    saveStructure({
      value: structure,
      type,
      name,
      valueId,
      isDuplicate,
    });
  };

  useEffect(() => {
    setAreAllFieldsValid(Boolean(isValid));
  }, []);

  useEffect(() => {
    setName(nameFromProps);
  }, [nameFromProps]);

  return (
    <div key={componentId} style={{ marginBottom: 10, marginTop: 10 }}>
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
                defaultValue={name}
              />
              <br />
            </Then>
          </If>
        </Then>
      </If>
      <If condition={!duplicateAvailable || type !== DROP_DOWN}>
        <Then>
          <ComponentByType
            type={type}
            structure={structure}
            name={name}
            error={error}
            value={value}
            forInstance={Boolean(forInstance)}
            forStructure={forStructure}
            structureBuilder={!forInstance ? structureBuilder : () => {}}
            setName={setName}
            saveStructureHandler={
              !forInstance ? saveStructureHandler : () => {}
            }
            instanceId={instanceId}
            formId={formId}
            title={title}
            fieldId={fieldId}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <br />
        </Then>
      </If>
      <If condition={!Boolean(forInstance)}>
        <Then>
          <Button
            style={{ marginTop: 10 }}
            onClick={() => {
              removeHandler(componentId, name);
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

import React, { useState, useEffect } from "react";
import { If, Then } from "react-if";
import { Button } from "antd";
import { v4 as uuidv4 } from "uuid";
import has from "lodash/has";

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
}) {
  const [name, setName] = useState(nameFromProps || "");
  const [structure, setStructure] = useState(initialStrucutre);
  const [error, setError] = useState("");
  const isValid = validateField(structure, type, name);

  const structureBuilder = (data) => {
    // const isNewItem =
    //   (Array.isArray(data[name]) && data[name].length === 1) ||
    //   (!Array.isArray(data[name]) && !has(data, "uid"));

    // if (isNewItem) {
    //   data.uid = uuidv4();
    // }
    const structureCopy = { ...structure };

    structureCopy.valueId = valueId;
    if (structure.name === DROP_DOWN) {
      structureCopy.values = transformObjectDataIntoArray(data, "values")[0];
      setStructure({ ...structureCopy });
      return;
    }

    setStructure({ ...structureCopy, ...data });
  };

  const saveStructureHandler = () => {
    if (!name.length || !isValid) {
      if (type !== INPUT) {
        saveStructure({
          name,
          valueId,
          forComplicatedType: true,
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
    });
  };

  useEffect(() => {
    setAreAllFieldsValid(Boolean(isValid));
  }, []);

  // useEffect(() => {
  //   if (
  //     (type === TABLE && !name.length) ||
  //     !validateField(structure, type, name)
  //   ) {
  //     saveStructure({
  //       value: structure,
  //       type,
  //       name,
  //       oldName,
  //       uid: structure.uid,
  //       valueId,
  //     });
  //   }
  // }, [structure]);

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
            name={name}
            structureBuilder={!forInstance ? structureBuilder : () => {}}
            setName={setName}
            saveStructureHandler={
              !forInstance ? saveStructureHandler : () => {}
            }
            structure={structure}
            error={error}
            forInstance={Boolean(forInstance)}
            value={value}
            forStructure={forStructure}
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

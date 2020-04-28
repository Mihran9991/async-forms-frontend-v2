import React, { useState, useEffect } from "react";
import { If, Then } from "react-if";
import { Divider, Button } from "antd";
import { v4 as uuidv4 } from "uuid";
import isObject from "lodash/isObject";

import FormName from "../../sharedComponents/Form/FormName";
import Card from "../../sharedComponents/Card";
import GenericFieldType from "../../sharedComponents/formValueTypes/GenericValueType";
import DropDown from "../../sharedComponents/formValueTypes/DropDown";
import { DROP_DOWN, INPUT, TABLE } from "../../constants/formConstants";
import { transformObjectDataIntoArray } from "../../utils/dataTransformUtil";
import { create } from "../../services/request/formService";

const DDItems = [
  { key: "structPiece", value: DROP_DOWN },
  { key: "structPiece", value: INPUT },
  { key: "structPiece", value: TABLE },
];

function Create() {
  const [title, setTitle] = useState("");
  const [structureComponents, setStructureComponents] = useState([]);
  const [structure, setStructure] = useState({ name: title, fields: [] });
  const [areAllFieldsValid, setAreAllFieldsValid] = useState(false);

  const addStructureComponent = ({ structPiece }) => {
    setStructureComponents([
      ...structureComponents,
      { structPiece, uid: uuidv4() },
    ]);
  };

  const removeStructurePieceHandler = (id, name) => {
    const structureComponentsCopy = [...structureComponents].filter(
      ({ uid }) => uid !== id
    );
    const structureCopy = { ...structure };

    structureCopy.fields = structureCopy.fields.filter(
      ({ name: fieldName }) => name !== fieldName
    );

    setStructure(structureCopy);
    setStructureComponents(structureComponentsCopy);
  };

  const saveStructure = ({ type, name, oldName, optional = true, value }) => {
    const copyStructure = { ...structure };
    const valueByType = () => {
      if (isObject(value)) {
        return transformObjectDataIntoArray(value, "values")[0];
      }

      return value;
    };

    const filteredFields = () => {
      if (Array.isArray(copyStructure.fields)) {
        return copyStructure.fields.filter(({ name }) => {
          return name !== oldName;
        });
      }

      return [];
    };

    const currentStructPiece = {
      name,
      type: {
        name: type,
        [value && "fields"]: valueByType(),
      },
      style: {},
      optional,
    };

    copyStructure.fields = filteredFields();
    copyStructure.fields.push(currentStructPiece);
    setStructure(copyStructure);
  };

  useEffect(() => {
    setStructure({ ...structure, name: title });
  }, [title]);

  return (
    <Card>
      <FormName saveTitle={setTitle} title={title} />
      <If condition={title.length > 0}>
        <Then>
          <span>Add new fields</span>
          <DropDown
            style={{ marginBottom: 10 }}
            items={DDItems}
            cb={addStructureComponent}
            disabled={structureComponents.length && !areAllFieldsValid}
          />
          {structureComponents.map(({ structPiece, uid }, idx) => {
            return (
              <>
                {idx === 0 && <Divider className="divider" />}
                <GenericFieldType
                  key={`${structPiece}_${idx}`}
                  type={structPiece}
                  uid={uid}
                  removeHandler={removeStructurePieceHandler}
                  saveStructure={saveStructure}
                  setAreAllFieldsValid={setAreAllFieldsValid}
                />
                {idx !== structureComponents.length - 1 && (
                  <Divider className="divider" />
                )}
              </>
            );
          })}

          <If condition={areAllFieldsValid}>
            <Then>
              <Button type="primary" onClick={() => create(structure)}>
                Save Structure
              </Button>
            </Then>
          </If>
        </Then>
      </If>
    </Card>
  );
}

export default Create;

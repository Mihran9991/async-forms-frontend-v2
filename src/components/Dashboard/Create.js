import React, { useState, useEffect } from "react";
import { If, Then } from "react-if";
import { Button, message } from "antd";
import { v4 as uuidv4 } from "uuid";
import isObject from "lodash/isObject";
import has from "lodash/has";
import get from "lodash/get";

import FormName from "../../sharedComponents/Form/FormName";
import Card from "../../sharedComponents/Card";
import FieldList from "../../sharedComponents/Form/FieldList";
import FieldName from "../../sharedComponents/Form/FieldName";
import { DROP_DOWN, INPUT } from "../../constants/formConstants";
import { DUPLICATE_FIELD } from "../../constants/errorMessages";
import { create } from "../../services/request/formService";
import {
  filterObjectByKey,
  transformObjectDataIntoArray,
} from "../../utils/dataTransformUtil";
import {
  doesFieldsContainsDuplicate,
  removeFromFields,
} from "../../utils/formUtil";

// TODO:: remove
console.warn = console.error = () => {};

function Create() {
  const [title, setTitle] = useState("");
  const [structureComponents, setStructureComponents] = useState([]);
  const [structure, setStructure] = useState({ name: title, fields: [] });
  const [areAllFieldsValid, setAreAllFieldsValid] = useState(false);
  const [duplicateAvailable, setDuplicateAvailable] = useState(false);
  const [fieldsHash, setFieldsHash] = useState({});
  const saveStructureDisabled = Boolean(
    areAllFieldsValid && structureComponents.length && !duplicateAvailable
  );

  // console.log("areAllFieldsValid", areAllFieldsValid);
  // console.log("structureComponents", structureComponents);
  // console.log("duplicateAvailable", duplicateAvailable);

  const addStructureComponent = ({ structPiece }) => {
    setStructureComponents([
      ...structureComponents,
      { structPiece, uid: uuidv4() },
    ]);
    setAreAllFieldsValid(false);
  };

  const removeStructurePieceHandler = (id, name) => {
    const copyStructure = { ...structure };
    const fieldsHashCopy = { ...fieldsHash };
    const structureComponentsCopy = [...structureComponents].filter(
      ({ uid }) => uid !== id
    );

    copyStructure.fields = copyStructure.fields.filter(
      ({ name: fieldName }) => name !== fieldName
    );

    delete fieldsHashCopy[name];

    setFieldsHash(fieldsHashCopy);
    setDuplicateAvailable(false);
    setStructure(copyStructure);
    setStructureComponents(structureComponentsCopy);
  };

  const saveStructure = ({
    type,
    name,
    optional = true,
    value,
    valueId: fieldUid,
    // uid: fieldUid,
  }) => {
    const uid = fieldUid
      ? fieldUid
      : structureComponents[structureComponents.length - 1].uid;
    const fieldsHashCopy = { ...fieldsHash };
    const copyStructure = { ...structure };
    const fields = copyStructure.fields;

    // console.log("name", name);
    // console.log("fieldsHash", fieldsHash);
    // console.log("uid", uid);

    console.log(" ------------- ))))))))))))))))))>", uid);

    const isDuplicate = has(fieldsHash, name) && fieldsHash[name] !== uid;

    const valueByType = () => {
      if (isObject(value)) {
        return (
          get(value, "values", false) ||
          get(value, `${name}`, false) ||
          get(value, "fields", false) ||
          transformObjectDataIntoArray(
            filterObjectByKey(value, "uid"),
            "values"
          )[0]
        );
      }

      return value;
    };
    const currentStructPiece = () => {
      if (type === INPUT) {
        return {
          uid,
          name,
          type: {
            name: type,
          },
          style: {},
          optional,
        };
      } else {
        return {
          uid,
          name,
          type: {
            name: type,
            [value &&
            (type === DROP_DOWN ? "values" : "fields")]: valueByType(),
          },
          style: {},
          optional,
        };
      }
    };
    const updateFieldsHashByValue = (val) => {
      console.log("new  fieldsHashCopy", fieldsHashCopy);
      const newFieldsHash = {};
      const entries = Object.entries(fieldsHashCopy);
      for (let i = 0; i < entries.length; ++i) {
        const key = entries[i][0];
        const val = entries[i][1];

        if (val !== uid) {
          newFieldsHash[key] = val;
        }
      }

      console.log("updated fieldsHashCopy", { ...newFieldsHash, [name]: uid });
      setFieldsHash({ ...newFieldsHash, [name]: uid });
    };

    if (isDuplicate) {
      setAreAllFieldsValid(false);
      setDuplicateAvailable(true);
      message.error(DUPLICATE_FIELD);
    } else {
      setDuplicateAvailable(false);
    }

    let isNewField = true;

    for (let i = 0; i < fields.length; ++i) {
      if (fields[i].uid === uid) {
        isNewField = false;
        fields[i] = currentStructPiece();
        break;
      }
    }

    const newVal = currentStructPiece();
    if (isNewField && newVal) {
      fields.push(newVal);
    }

    updateFieldsHashByValue();
    setStructure(copyStructure);
  };

  // console.log("structure", structure);

  useEffect(() => {
    setStructure({ ...structure, name: title });
  }, [title]);

  return (
    <Card>
      <FormName saveTitle={setTitle} title={title} />
      <If condition={title.length > 0}>
        <Then>
          <FieldName
            disabled={
              (structureComponents.length && !areAllFieldsValid) ||
              duplicateAvailable
            }
            cb={addStructureComponent}
          />
          <FieldList
            list={structureComponents}
            structure={structure}
            fieldsHash={fieldsHash}
            saveStructure={saveStructure}
            duplicateAvailable={duplicateAvailable}
            setAreAllFieldsValid={setAreAllFieldsValid}
            removeStructurePieceHandler={removeStructurePieceHandler}
          />
          <If condition={saveStructureDisabled}>
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

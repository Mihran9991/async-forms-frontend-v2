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

  const addStructureComponent = ({ structPiece }) => {
    setStructureComponents([
      ...structureComponents,
      { structPiece, uid: uuidv4() },
    ]);
    setAreAllFieldsValid(false);
  };

  const removeStructurePieceHandler = (id, name) => {
    const structureCopy = { ...structure };
    const fieldsHashCopy = { ...fieldsHash };
    const structureComponentsCopy = [...structureComponents].filter(
      ({ uid }) => uid !== id
    );

    if (!duplicateAvailable) {
      delete fieldsHashCopy[name];
      setFieldsHash(fieldsHashCopy);
      structureCopy.fields = structureCopy.fields.filter(
        ({ name: fieldName }) => name !== fieldName
      );
    }

    setDuplicateAvailable(false);
    setStructure(structureCopy);
    setStructureComponents(structureComponentsCopy);
  };

  const saveStructure = ({
    type,
    name,
    oldName,
    optional = true,
    value,
    uid,
    forComplicatedType,
    valueId,
  }) => {
    if (
      has(fieldsHash, name) &&
      fieldsHash[name] !== uid &&
      fieldsHash[name] !== valueId
    ) {
      setAreAllFieldsValid(false);
      setDuplicateAvailable(true);
      if (forComplicatedType || type === INPUT) {
        message.error(DUPLICATE_FIELD);
      }

      return;
    }

    setDuplicateAvailable(false);
    if (!forComplicatedType) {
      setFieldsHash({ ...fieldsHash, [name]: uid });
      const copyStructure = { ...structure };
      const valueByType = () => {
        if (isObject(value)) {
          return (
            get(value, "values", false) ||
            get(value, `${name}`, false) ||
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
            uid: uuidv4(),
            name,
            type: {
              name: type,
            },
            style: {},
            optional,
          };
        } else {
          return {
            uid: uuidv4(),
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
      const fields = copyStructure.fields;

      let isNewField = true;
      for (let i = 0; i < fields.length; ++i) {
        if (!duplicateAvailable && fields[i].name === oldName) {
          isNewField = false;
          fields[i] = currentStructPiece();
          break;
        }
      }

      if (isNewField) {
        copyStructure.fields.push(currentStructPiece());
      }

      setStructure(copyStructure);
    }
  };

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
            // duplicateFieldUid={
            //   structureComponents.length
            //     ? structureComponents[structureComponents.length - 1].uid
            //     : ""
            // }
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

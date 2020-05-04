import React from "react";
import get from "lodash/get";
import { Divider } from "antd";

import GenericFieldType from "../../sharedComponents/formValueTypes/GenericFieldType";
import { TABLE } from "../../constants/formConstants";

function FieldList({
  list,
  structure,
  fieldsHash,
  saveStructure,
  duplicateAvailable,
  setAreAllFieldsValid,
  removeStructurePieceHandler,
  duplicateFieldsHash,
  duplicateHashesMemo,
}) {
  // console.log("duplicateFieldsHash", duplicateFieldsHash);
  // console.log("fieldsHash", fieldsHash);
  // console.log("duplicateHashesMemo", duplicateHashesMemo);
  // console.log("duplicateAvailable ------------>", duplicateAvailable);

  return (
    <>
      {list.map(({ structPiece, uid }, idx) => {
        const fields = structure.fields;
        const field = (() => {
          for (let i = 0; i < fields.length; ++i) {
            const element = fields[i];
            if (element.uid === uid) {
              return element;
            }
          }

          return {};
        })();
        const name = (() => {
          if (get(field, `uid`, "") === uid) {
            return get(field, `name`, "");
          }

          return "";
        })();
        const initialStrucutre = get(field, `type`, {});
        const isDuplicate = field.duplicate;
        // console.log("00000000000000", isDuplicate, "000000000000000000000");
        const valueId = (() => {
          if (isDuplicate) {
            // console.log("FROM DUPLICATE", duplicateFieldsHash, name);
            return get(duplicateFieldsHash, name, "");
          }

          // console.log(" NOT FROM DUPLICATE", fieldsHash, name);
          duplicateHashesMemo = {};
          return get(fieldsHash, name, "");
        })();

        const value =
          structPiece !== TABLE
            ? get(field, `type.values`, false) ||
              get(field, `type.${name}`, false)
            : get(field, `type.fields`, []);

        // console.log("valueId --------->", valueId);

        return (
          <>
            {idx === 0 && <Divider className="divider" />}
            <GenericFieldType
              key={`${structPiece}_${idx}`}
              type={structPiece}
              componentId={uid}
              valueId={valueId}
              removeHandler={removeStructurePieceHandler}
              saveStructure={saveStructure}
              setAreAllFieldsValid={setAreAllFieldsValid}
              duplicateAvailable={duplicateAvailable}
              forStructure
              name={name}
              initialStrucutre={initialStrucutre}
              value={value}
              forInstance={false}
              isDuplicate={isDuplicate}
            />
            {idx !== list.length - 1 && <Divider className="divider" />}
          </>
        );
      })}
    </>
  );
}

export default FieldList;

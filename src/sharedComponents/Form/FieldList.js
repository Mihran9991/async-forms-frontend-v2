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
}) {
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
        const valueId = get(fieldsHash, name, "");
        const value =
          structPiece !== TABLE
            ? get(field, `type.values`, false) ||
              get(field, `type.${name}`, false)
            : get(field, `type.fields`, []);

        // console.log("fieldsHash", fieldsHash, "name", name);
        // console.log("field UID", valueId);

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
            />
            {idx !== list.length - 1 && <Divider className="divider" />}
          </>
        );
      })}
    </>
  );
}

export default FieldList;

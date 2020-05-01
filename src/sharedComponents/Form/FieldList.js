import React from "react";
import get from "lodash/get";
import { Divider } from "antd";

import GenericFieldType from "../../sharedComponents/formValueTypes/GenericFieldType";
import { TABLE } from "../../constants/formConstants";
import { reconstructColumnsData } from "../../utils/formUtil";

function FieldList({
  list,
  structure,
  fieldsHash,
  saveStructure,
  duplicateAvailable,
  setAreAllFieldsValid,
  removeStructurePieceHandler,
  // duplicateFieldUid,
}) {
  return (
    <>
      {list.map(({ structPiece, uid }, idx) => {
        const field = structure.fields[idx];
        const name = get(field, `name`, "");
        const initialStrucutre = get(field, `type`, {});
        const valueId = get(fieldsHash, name, "");
        const value =
          structPiece !== TABLE
            ? get(field, `type.values`, false) || get(field, `type.${name}`, {})
            : get(field, `type.fields`, []);

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

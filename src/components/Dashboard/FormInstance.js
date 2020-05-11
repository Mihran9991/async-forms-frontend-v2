import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import GenericFieldType from "../../sharedComponents/formValueTypes/GenericFieldType";
import { DROP_DOWN, TABLE } from "../../constants/formConstants";
import { reconstructColumnsData } from "../../utils/formUtil";
import { getFormInstance } from "../../services/request/formService";
import { initSpecificEvents } from "../../services/socket";
import useUser from "../../hooks/useUser";

function FormInstance({
  data: { name, structure, title, formId, instanceId, ownerId },
}) {
  const user = useUser();
  const currentUserEmail = get(user, "email", "");
  const [instanceData, setInstanceData] = useState({});
  const [isSPinning, setIsSPinning] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setIsSPinning(true);

      try {
        const { data } = await getFormInstance({
          params: {
            formName: title,
            instanceName: instanceId,
          },
        });

        initSpecificEvents({ setInstanceData });
        setInstanceData(data);
      } catch (e) {
        console.log("err", e);
      } finally {
        setIsSPinning(false);
      }
    };

    getData();
  }, []);

  return (
    <Spin spinning={isSPinning}>
      <h2>{name}</h2>
      {!isEmpty(instanceData) &&
        structure.fields.map((field) => {
          const type = field.type.name;
          // TODO:: remove parsing
          const isLocked = JSON.parse(
            get(instanceData, `${field.name}.isLocked`, "false")
          );
          const lockedBy = get(instanceData, `${field.name}.lockedBy`, "");
          const existingValue =
            type === TABLE
              ? get(instanceData, `${field.name}.fields`, [])
              : get(instanceData, `${field.name}.value`, "");
          const value = (() => {
            if (type === DROP_DOWN) {
              return {
                items: field.type.values,
                defaultValue: existingValue,
              };
            }

            if (type === TABLE) {
              return {
                columns: reconstructColumnsData(field.type.fields),
                rows: existingValue,
              };
            }

            return existingValue;
          })();

          return (
            <div>
              <span>{field.name}</span>
              <GenericFieldType
                type={type}
                setAreAllFieldsValid={() => {}}
                saveStructure={() => {}}
                forInstance
                value={value}
                instanceId={instanceId}
                formId={formId}
                title={title}
                fieldId={field.name}
                ownerId={ownerId}
                withLoading
                isLocked={isLocked}
                currentUserEmail={currentUserEmail}
                lockedBy={lockedBy}
              />
            </div>
          );
        })}
    </Spin>
  );
}

export default FormInstance;

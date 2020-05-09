import React, { useEffect, useState } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import GenericFieldType from "../../sharedComponents/formValueTypes/GenericFieldType";
import { DROP_DOWN, TABLE } from "../../constants/formConstants";
import { reconstructColumnsData } from "../../utils/formUtil";
import { getFormInstance } from "../../services/request/formService";

function FormInstance({
  data: { name, structure, title, formId, instanceId, ownerId },
}) {
  const [instanceData, setInstanceData] = useState({});

  useEffect(() => {
    const getData = async () => {
      const { data } = await getFormInstance({
        params: {
          formName: title,
          instanceName: instanceId,
        },
      });

      setInstanceData(data);
    };

    getData();
  }, []);

  return (
    <div>
      <h2>{name}</h2>
      {!isEmpty(instanceData) &&
        structure.fields.map((field) => {
          const type = field.type.name;
          const value = (() => {
            if (type === DROP_DOWN) {
              return {
                items: field.type.values,
                defaultValue: get(instanceData, `${field.name}.value`, ""),
              };
            }

            if (type === TABLE) {
              return {
                columns: reconstructColumnsData(field.type.fields),
                rows: get(instanceData, `${field.name}.fields`, []),
              };
            }

            return get(instanceData, `${field.name}.value`, "");
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
              />
            </div>
          );
        })}
    </div>
  );
}

export default FormInstance;

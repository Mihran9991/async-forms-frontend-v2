import React, { useState, useEffect } from "react";
import { If, Then } from "react-if";
import { v4 as uuidv4 } from "uuid";

import FormName from "../../sharedComponents/Form/FormName";
import Card from "../../sharedComponents/Card";
import EditabelTable from "../../sharedComponents/editabelTable";
import DropDown from "../../sharedComponents/formValueTypes/DropDown";
import Input from "../../sharedComponents/formValueTypes/Input";
import isEmpty from "lodash/isEmpty";

import {
  transformObjectDataIntoArray,
  filterObjectByKey,
} from "../../utils/dataTransformUtil";
import {
  generateRowByColumns,
  isInvalidColumnAvailable,
  isDuplicateColumnAvailable,
} from "../../utils/formUtil";
import { DROP_DOWN, INPUT, TABLE } from "../../constants/formConstants";
import { Button } from "antd";

const DDItems = [
  { key: "structPiece", value: DROP_DOWN },
  { key: "structPiece", value: INPUT },
  { key: "structPiece", value: TABLE },
];

function FieldByType({ type, uid, removeHandler, saveStructure }) {
  const [name, setName] = useState("");
  const [structure, setStructure] = useState({});

  const structureBuilder = (data) => {
    setStructure({ ...structure, ...data });
  };

  const saveStructureHandler = () => {
    saveStructure({ value: type === INPUT ? name : structure, type, name });
  };

  let component;
  let withName = false;
  switch (type) {
    case INPUT: {
      component = null;
      withName = true;
      break;
    }
    case DROP_DOWN: {
      component = (
        <DropDown
          propName={name}
          disabled={!name.length}
          items={[]}
          cb={structureBuilder}
        />
      );
      withName = true;
      break;
    }
    case TABLE: {
      component = (
        <EditabelTable
          propName={name}
          disabled={!name.length}
          title=""
          rows={[]}
          columns={[]}
        />
      );
      withName = true;
      break;
    }
    default: {
      component = null;
      withName = true;
      break;
    }
  }

  return (
    <div key={uid} style={{ marginBottom: 10, marginTop: 10 }}>
      <If condition={withName}>
        <Then>
          <Input
            disabled={!isEmpty(structure) && type !== INPUT}
            cb={setName}
            callbackResponseOnlyValue
            placeholder={"Type field name"}
          />
          <br />
        </Then>
      </If>
      {component}
      <If condition={name.length > 0}>
        <Then>
          <Button onClick={saveStructureHandler}>Save</Button>
        </Then>
      </If>
      <Button onClick={() => removeHandler(uid)}>Remove</Button>
    </div>
  );
}

function Create() {
  // Form name
  const [title, setTitle] = useState("");

  // Form table props
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const [structureComponents, setStructureComponents] = useState([]);
  const [structure, setStructure] = useState({ name: title, fields: [] });

  const [specificData, setSpecificData] = useState({});
  const transformedColumns = transformObjectDataIntoArray(columns, "values");

  const deleteColumnByNameHandler = (id) => {
    const columnsCopy = [...columns].filter((col) => {
      return col.dataIndex !== id;
    });

    setColumns(columnsCopy);
  };

  const createColumnHandler = () => {
    if (isInvalidColumnAvailable(transformedColumns)) {
      alert("Please fill current column before trying to create news");
      return;
    }

    const emptyColumn = {
      dataIndex: "",
      width: "25%",
      editable: true,
      type: "",
      uid: uuidv4(),
    };

    setColumns([...columns, emptyColumn]);
  };

  const editColumnHandler = (oldName, uid, { name, type }) => {
    if (isDuplicateColumnAvailable(columns, { name, uid })) {
      alert("Duplicate column");
      return;
    }

    const columnsCopy = [...columns];

    for (let i = 0; i < columnsCopy.length; ++i) {
      if (
        columnsCopy[i].dataIndex === oldName ||
        columnsCopy[i].dataIndex === ""
      ) {
        columnsCopy[i] = {
          ...columnsCopy[i],
          dataIndex: name,
          type,
        };
        break;
      }
    }

    setColumns(columnsCopy);
  };

  const createRowHandler = () => {
    setRows([
      ...rows,
      { key: String(rows.length), ...generateRowByColumns(columns) },
    ]);
  };

  const deleteRowHandler = (rowId) => {
    const specificDataCopy = { ...specificData };
    const keys = Object.keys(specificData);
    for (let i = 0; i < keys.length; ++i) {
      const extractedKey = keys[i].split("-")[0];
      if (extractedKey == rowId) {
        const newData = filterObjectByKey(specificDataCopy, keys[i]);
        setSpecificData(newData);
        break;
      }
    }

    const updatedRows = [...rows].filter(({ key }, idx) => key !== rowId);

    setRows(updatedRows);
  };

  const addStructureComponent = ({ structPiece }) => {
    setStructureComponents([
      ...structureComponents,
      { structPiece, uid: uuidv4() },
    ]);
  };

  const removeStructurePieceHandler = (id) => {
    const structureCopy = [...structureComponents].filter(
      ({ uid }) => uid !== id
    );

    setStructureComponents(structureCopy);
  };

  //
  const saveStructure = ({ type, name, optional, value }) => {
    const copyStructure = { ...structure };

    const currentStructPiece = {
      name,
      type: {
        name: type,
        [value && "values"]: value,
      },
      style: {},
      optional,
    };
    copyStructure.fields.push(currentStructPiece);
    setStructure(copyStructure);
  };

  console.log("structure", structure);

  useEffect(() => {
    setStructure({ ...structure, name: title });
  }, [title]);

  return (
    <Card>
      <FormName saveTitle={setTitle} title={title} />

      <If condition={title.length}>
        <Then>
          <DropDown items={DDItems} cb={addStructureComponent} />
          {structureComponents.map(({ structPiece, uid }) => {
            return (
              <FieldByType
                type={structPiece}
                uid={uid}
                removeHandler={removeStructurePieceHandler}
                saveStructure={saveStructure}
              />
            );
          })}

          {/* <EditabelTable
            deleteColumnByNameHandler={deleteColumnByNameHandler}
            editColumnHandler={editColumnHandler}
            createRowHandler={createRowHandler}
            deleteRowHandler={deleteRowHandler}
            editRowHandler={setRows}
            createColumnHandler={createColumnHandler}
            rows={rows}
            columns={columns}
            specificData={specificData}
            specificDataHandler={(newData) => {
              setSpecificData({ ...specificData, ...newData });
            }}
          /> */}
        </Then>
      </If>
    </Card>
  );
}

export default Create;

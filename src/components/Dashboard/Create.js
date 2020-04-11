import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { If, Else, Then } from "react-if";
import classnames from "classnames";
import isEqual from "lodash/isEqual";

import Stepper from "../../sharedComponents/Stepper";
import Card from "../../sharedComponents/Card";
import Input from "../../sharedComponents/formValueTypes/Input";
import InputGroup from "../../sharedComponents/InputGroup";
import Table from "../../sharedComponents/Table";
import DropDown from "../../sharedComponents/formValueTypes/DropDown";
import {
  TABLE_DATA_TYPES,
  COLUMN_KEYS,
  POSSIBLE_STRUCTURE_PIECES,
} from "../../constants/tableConstants";
import styles from "./dashboard.module.scss";

function Create() {
  const [isPendingColumn, setIsPendingColumn] = useState(false);
  const [isPendingRow, setIsPendingRow] = useState(false);
  const [currentColumn, setCurrentColumn] = useState({});
  const [currentRow, setCurrentRow] = useState({});
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState("");

  const saveColumn = () => {
    setColumns([...columns, currentColumn]);
    setIsPendingColumn(false);
    setCurrentColumn({});
  };

  const saveRow = () => {
    setRows([...rows, currentRow]);
    setIsPendingRow(false);
    setCurrentRow({});
  };

  const setTableStructure = (data, structureType) => {
    const [[key, value]] = Object.entries(data);
    const isStructureRow = structureType === POSSIBLE_STRUCTURE_PIECES.row;

    if (!value) {
      const currentStructurePieceCopy = isStructureRow
        ? { ...currentRow }
        : { ...currentColumn };

      delete currentStructurePieceCopy[key];

      if (isStructureRow) {
        setCurrentRow(currentStructurePieceCopy);
      } else {
        setCurrentColumn(currentStructurePieceCopy);
      }
    } else {
      if (isStructureRow) {
        setCurrentRow({
          ...currentRow,
          ...data,
        });
      } else {
        setCurrentColumn({
          ...currentColumn,
          ...data,
        });
      }
    }
  };

  const isCurrentColumnValid = () => {
    const currentColumnProperties = Object.keys(currentColumn).sort();

    return isEqual(currentColumnProperties, COLUMN_KEYS);
  };

  const isCurrentRowValid = () => {
    const currentRowProperties = Object.keys(currentRow).sort();
    const columnNames = columns.map(({ name }) => name);

    return isEqual(currentRowProperties, columnNames);
  };

  return (
    <>
      <Card>
        <Stepper
          allowNext={[!!title, !isPendingColumn && columns.length > 0, true]}
        >
          <div className={styles["add-table-name"]}>
            <h4>Add Table Name</h4>
            <Input
              cb={setTitle}
              propName="table-name"
              type="text"
              defaultValue={title}
              onlyValue
            />
          </div>
          <div className={styles["add-table-columns"]}>
            <h4>Add Table Column</h4>
            <If condition={isPendingColumn}>
              <Then>
                <InputGroup>
                  <div
                    className={classnames({
                      [styles["enter-column-name"]]: true,
                      [styles["input-group-item"]]: true,
                    })}
                  >
                    <span>Enter Column Name</span>
                    <Input
                      cb={(data) => setTableStructure(data, "column")}
                      propName="name"
                      type="text"
                    />
                  </div>
                  <div
                    className={classnames({
                      [styles["select-field-type"]]: true,
                      [styles["input-group-item"]]: true,
                    })}
                  >
                    <span>Choose Column Type</span>
                    <DropDown
                      cb={(data) => setTableStructure(data, "column")}
                      items={TABLE_DATA_TYPES}
                    />
                  </div>
                </InputGroup>
                <If condition={isCurrentColumnValid()}>
                  <Button variant="outline-success" onClick={saveColumn}>
                    Save
                  </Button>
                </If>
              </Then>
              <Else>
                <Button
                  variant="outline-success"
                  onClick={() => setIsPendingColumn(true)}
                >
                  Add Column
                </Button>
              </Else>
            </If>
          </div>
          <div className={styles["add-table-rows"]}>
            <h4>Add Table Row</h4>
            <InputGroup.Generic
              data={columns}
              cb={(data) => setTableStructure(data, "row")}
            />
            <If condition={isPendingRow}>
              <Then>
                <Button
                  variant="outline-success"
                  onClick={() => setIsPendingRow(true)}
                >
                  Add Row
                </Button>
              </Then>
              <Else>
                <If condition={isCurrentRowValid()}>
                  <Then>
                    <Button variant="outline-success" onClick={saveRow}>
                      Save
                    </Button>
                  </Then>
                </If>
              </Else>
            </If>
          </div>
        </Stepper>
      </Card>
      <Table title={title} columns={columns} rows={rows} />
    </>
  );
}

export default Create;

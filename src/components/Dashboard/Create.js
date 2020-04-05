import React, { useState } from "react";
import styles from "./dashboard.module.scss";
import { If, Else, Then } from "react-if";
import Button from "react-bootstrap/Button";
import Stepper from "../../sharedComponents/Stepper";
import Card from "../../sharedComponents/Card";
import Input from "../../sharedComponents/formValueTypes/Input";
import InputGroup from "../../sharedComponents/InputGroup";
import Table from "../../sharedComponents/Table";
import DropDown from "../../sharedComponents/formValueTypes/DropDown";

function Create() {
  const [isPendingColumn, setIsPendingColumn] = useState(false);
  const [currentColumn, setCurrentColumn] = useState({});
  const [columns, setColumns] = useState([]);

  const saveColumnHandler = () => {
    setColumns([...columns, currentColumn]);
    setIsPendingColumn(false);
  };

  const setColumnValues = (newValue) => {
    setCurrentColumn({
      ...currentColumn,
      ...newValue,
    });
  };

  return (
    <Stepper allowNext={columns.length > 0}>
      <Card className={styles["table-name"]}>
        <h4>Add field</h4>
        <If condition={isPendingColumn}>
          <Then>
            <InputGroup>
              <div className={styles["enter-field-name"]}>
                <span>Enter Name</span>
                <Input cb={setColumnValues} propName="name" type="text" />
              </div>
              <div className={styles["select-field-type"]}>
                <span>Choose Type</span>
                <DropDown
                  cb={setColumnValues}
                  items={[{ value: "Drop Down" }, { value: "Input" }]}
                />
              </div>
            </InputGroup>
            <Button variant="outline-success" onClick={saveColumnHandler}>
              Save
            </Button>
          </Then>
          <Else>
            <Button
              variant="outline-success"
              onClick={() => setIsPendingColumn(true)}
            >
              Add field
            </Button>
          </Else>
        </If>
      </Card>
      <Table columns={columns} />
    </Stepper>
  );
}

export default Create;

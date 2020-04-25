import React, { useEffect, useState } from "react";
import { Button, Table as FormBT } from "react-bootstrap";
import { If, Then } from "react-if";
import isEmpty from "lodash/isEmpty";

import Header from "../../sharedComponents/Form/Header";
import Body from "../../sharedComponents/Form/Body";
import { create } from "../../services/request/formService";

function Form({
  title,
  columns,
  rows,
  createRowHandler,
  deleteRowHandler,
  editRowHandler,
  editColumnHandler,
  deleteColumnByNameHandler,
  createColumnHandler,
  isInvalidColumnAvailable,
}) {
  const [formData, setFormData] = useState({
    title,
    columns,
    rows,
  });

  const isRowReadyForSubmit = !(
    isEmpty(title) ||
    isEmpty(columns) ||
    isEmpty(rows) ||
    isInvalidColumnAvailable
  );

  useEffect(() => {
    setFormData({
      title,
      columns,
      rows,
    });
  }, [title, columns, rows]);

  return (
    <If condition={title.length > 0}>
      <Then>
        <h2>{title}</h2>
        <If condition={!isEmpty(columns) && !isInvalidColumnAvailable}>
          <Button variant="outline-success" onClick={createRowHandler}>
            Add Row
          </Button>
        </If>
        <Button variant="outline-success" onClick={createColumnHandler}>
          Add Column
        </Button>
        <FormBT
          striped
          bordered
          hover
          responsive
          //  variant="dark"
        >
          <Header
            columns={columns}
            editable={!rows.length}
            editColumnHandler={editColumnHandler}
            deleteColumnByNameHandler={deleteColumnByNameHandler}
          />
          <Body
            rows={rows}
            deleteRowHandler={deleteRowHandler}
            editRowHandler={editRowHandler}
          />
        </FormBT>
        <If condition={isRowReadyForSubmit}>
          <Then>
            <Button
              variant="outline-success"
              onClick={() => {
                create(formData);
              }}
            >
              Save Form
            </Button>
          </Then>
        </If>
      </Then>
    </If>
  );
}

export default Form;

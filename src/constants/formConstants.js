import DropDown from "../sharedComponents/formValueTypes/DropDown";
import Input from "../sharedComponents/formValueTypes/Input";

export const DROP_DOWN = "dropdown";
export const INPUT = "input";
export const TABLE = "table";
export const OPERATION = "operation";
export const DROP_DOWN_INITIAL_VALUE = [];
export const INPUT_INITIAL_VALUE = "";

export const FORM_DATA_TYPES = [
  { value: DROP_DOWN, component: DropDown, key: "type" },
  { value: INPUT, component: Input, key: "type" },
];

export const COLUMN_KEYS = ["name", "type"].sort();

export const EMPTY_VALUE = "N/A";

export const AUDIT_TABLE_COLUMNS = [
  {
    title: "Owner",
    dataIndex: "owner",
    key: "owner",
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
  },
  {
    title: "Date",
    dataIndex: "createdAt",
    key: "createdAt",
  },
];

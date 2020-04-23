import DropDown from "../sharedComponents/formValueTypes/DropDown";
import Input from "../sharedComponents/formValueTypes/Input";

export const DROP_DOWN = "Drop Down";
export const INPUT = "Input";
export const DROP_DOWN_INITIAL_VALUE = [];
export const INPUT_INITIAL_VALUE = "";

export const TABLE_DATA_TYPES = [
  { value: DROP_DOWN, component: DropDown, key: "type" },
  { value: INPUT, component: Input, key: "type" },
];

export const COLUMN_KEYS = ["name", "type"].sort();

export const EMPTY_VALUE = "N/A";

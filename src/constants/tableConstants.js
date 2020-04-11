import DropDown from "../sharedComponents/formValueTypes/DropDown";
import Input from "../sharedComponents/formValueTypes/Input";

export const TABLE_DATA_TYPES = [
  { value: "Drop Down", component: DropDown, key: "type" },
  { value: "Input", component: Input, key: "type" },
];

export const COLUMN_KEYS = ["name", "type"].sort();

export const POSSIBLE_STRUCTURE_PIECES = { row: "row", column: "column" };

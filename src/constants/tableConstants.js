import DropDown from "../sharedComponents/formValueTypes/DropDown";
import Input from "../sharedComponents/formValueTypes/Input";

export const DROP_DOWN = "Drop Down";
export const INPUT = "Input";

export const TABLE_DATA_TYPES = [
  { value: DROP_DOWN, component: DropDown, key: "type" },
  { value: INPUT, component: Input, key: "type" },
];

export const COLUMN_KEYS = ["name", "type"].sort();

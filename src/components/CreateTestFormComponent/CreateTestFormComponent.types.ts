export interface Option {
  value: string | number;
  label: string;
  stepKey?: number;
}

export interface InputTypes {
  name: string;
  label: string;
  type:
    | "select"
    | "text"
    | "date"
    | "number"
    | "searchable-select"
    | "multi-select";
  isRequired: boolean;
  hasPlaceholder?: boolean;
  hasDefaultValue?: boolean;
  defaultValue?: string | number;
  option?: Option[];
  showIf?: Partial<{
    field?: string;
    equals?: string;
  }>;
}

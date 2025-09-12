import type { Option } from "../CreateTestFormComponent/CreateTestFormComponent.types";

export interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
  value: string | number;
  onChange: (value: string | number) => void;
}

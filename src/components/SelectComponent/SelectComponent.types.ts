import type { Option } from "../CreateTestFormComponent/CreateTestFormComponent.types";

export interface SelectComponentProps {
  field: {
    name: string;
    option?: Option[];
  };
  formData: Record<string, any>;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  isBlocked: boolean;
  dependentFieldOption: Record<string, Option[]>;
}

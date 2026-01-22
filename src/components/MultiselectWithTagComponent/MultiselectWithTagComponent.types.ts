import type { Option } from "../CreateTestFormComponent/CreateTestFormComponent.types";

export interface MultiselectWithTagComponentProps {
  formData: Record<string, any>;
  field: {
    name: string;
    option?: Option[];
  };
  setFormData: (data: Record<string, any>) => void;
  isBlocked: boolean;
}

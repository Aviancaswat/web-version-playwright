import type { ChangeEvent } from "react";
import type { Test } from "../../store/useTestStore/useTestStore.types";
import type {
  InputTypes,
  Option,
} from "../CreateTestFormComponent/CreateTestFormComponent.types";

export interface CreateTestFormInputContainerProps {
  currentStepFields: {
    name: string;
    isRequired: boolean;
    label: string;
    type: InputTypes["type"];
    option?: InputTypes["option"];
  }[];
  formData: Record<string, string | number>;
  setFormData: (data: Record<string, string | number>) => void;
  editTest: Test | null;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  isBlocked: boolean;
  dependentFieldOption: Record<string, Option[]>;
  currentStepConfig: {
    key: number;
    stepTitle: string;
    hasOnlyText?: boolean;
    infoText?: string;
    input: {
      type: string;
      hasOnlyText?: boolean;
      infoText?: string;
    }[];
  };
  shouldShowField: (field: InputTypes) => boolean;
}

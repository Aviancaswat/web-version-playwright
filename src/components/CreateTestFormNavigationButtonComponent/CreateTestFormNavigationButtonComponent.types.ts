import type { Dispatch, SetStateAction } from "react";
import type { Test } from "../../store/useTestStore/useTestStore.types";
import type { Option } from "../CreateTestFormComponent/CreateTestFormComponent.types";

export interface CreateTestFormNavigationButtonComponentProps {
  currentStep: number;
  prevStep: () => void;
  nextStep: () => void;
  editTest: Test | null;
  formData: Record<string, string | number>;
  steps: number[];
  generateDefaultDataByStep: (
    formData: Record<string, any>
  ) => Record<string, any>;
  transformFormDataToTest: (raw: Record<string, any>) => { [x: string]: any };
  handleCreateTestsByLanguages: (data: Record<string, any>) => void;
  setFormData: (data: Record<string, string | number>) => void;
  setDependentFieldOption: Dispatch<SetStateAction<Record<string, Option[]>>>;
  setSteps: (steps: number[]) => void;
  setCurrentStep: (step: number) => void;
  initializeFormData: () => Record<string, string | number>;
  isStepComplete: (step: number) => boolean;
  handleSave: () => void;
}

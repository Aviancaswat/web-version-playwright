import type { RefObject } from "react";

export interface CreateTestFormStepHeaderComponentProps {
  steps: number[];
  stepFields: { key: number; stepTitle: string; input: {}[] }[];
  stepRefs: RefObject<HTMLElement[]>;
  currentStep: number;
}

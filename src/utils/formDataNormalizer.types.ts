import type { InputTypes } from "../components/CreateTestFormComponent/CreateTestFormComponent.types";

export interface FormDataNormalizerParams {
  data: Record<string, any>;
  stepFields: {
    key: number;
    stepTitle: string;
    input: {
      name: InputTypes["name"];
      type: string;
    }[];
  }[];
  type: "new" | "edit";
}

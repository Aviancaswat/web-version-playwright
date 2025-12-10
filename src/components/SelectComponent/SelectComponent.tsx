import { Select } from "@chakra-ui/react";

//Types
import type { Option } from "../CreateTestFormComponent/CreateTestFormComponent.types";
import type { SelectComponentProps } from "./SelectComponent.types";

const SelectComponent: React.FC<SelectComponentProps> = ({
  field,
  formData,
  handleInputChange,
  isBlocked,
  dependentFieldOption,
}) => {
  return (
    <Select
      name={field.name}
      value={formData[field.name] ?? ""}
      onChange={handleInputChange}
      disabled={isBlocked}
    >
      <option value="">Selecciona una opción</option>

      {(dependentFieldOption[field.name] ?? field.option ?? []).map(
        (option: Option, index: number) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        )
      )}
    </Select>
  );
};

export default SelectComponent;

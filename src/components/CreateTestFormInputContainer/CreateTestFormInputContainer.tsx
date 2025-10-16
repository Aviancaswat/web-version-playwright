import {
  Box,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Text,
} from "@chakra-ui/react";

//Components
import SelectComponent from "../SelectComponent/SelectComponent";
import SearchableSelectComponent from "../SearchableSelectComponent/SearchableSelectComponent";
import MultiselectWithTagComponent from "../MultiselectWithTagComponent/MultiselectWithTagComponent";

//Types
import type { CreateTestFormInputContainerProps } from "./CreateTestFormInputContainer.types";

const CreateTestFormInputContainer: React.FC<
  CreateTestFormInputContainerProps
> = ({
  currentStepFields,
  formData,
  setFormData,
  editTest,
  handleInputChange,
  isBlocked,
  dependentFieldOption,
  currentStepConfig,
  shouldShowField,
}) => {
  return (
    <Box flex="1 1 auto" minH={0} maxH="100%" overflowY="auto" pr={1}>
      {currentStepConfig?.hasOnlyText ? (
        <Text fontSize="md" textAlign={"center"} color="gray.700" p={4}>
          {currentStepConfig.infoText}
        </Text>
      ) : (
        <Grid templateColumns="repeat(2, 1fr)" alignItems="end" gap={4}>
          {currentStepFields
            .filter((field) => shouldShowField(field))
            .map((field, index, array) => (
              <GridItem
                key={field.name}
                colSpan={
                  array.length % 2 !== 0 && index === array.length - 1 ? 2 : 1
                }
              >
                <FormControl isRequired={field.isRequired}>
                  <FormLabel>{field.label}</FormLabel>
                  {field.type === "select" && (
                    <SelectComponent
                      field={field}
                      formData={formData}
                      handleInputChange={handleInputChange}
                      isBlocked={isBlocked}
                      dependentFieldOption={dependentFieldOption}
                    />
                  )}

                  {field.type === "searchable-select" && field.option && (
                    <SearchableSelectComponent
                      options={
                        field.name === "homeCiudadDestino" &&
                        formData["homeCiudadOrigen"]
                          ? field.option.filter(
                              (option) =>
                                option.value !== formData["homeCiudadOrigen"]
                            )
                          : field.option
                      }
                      value={formData[field.name] || ""}
                      onChange={(val) =>
                        setFormData({
                          ...formData,
                          [field.name]: val,
                        })
                      }
                    />
                  )}

                  {field.type === "multi-select" && (
                    <>
                      {editTest ? (
                        <SelectComponent
                          field={field}
                          formData={formData}
                          handleInputChange={handleInputChange}
                          isBlocked={isBlocked}
                          dependentFieldOption={dependentFieldOption}
                        />
                      ) : (
                        <MultiselectWithTagComponent
                          formData={formData}
                          field={field}
                          setFormData={setFormData}
                          isBlocked={isBlocked}
                        />
                      )}
                    </>
                  )}

                  {field.type !== "select" &&
                    field.type !== "searchable-select" &&
                    field.type !== "multi-select" && (
                      <Input
                        type={field.type}
                        min={new Date().toISOString().split("T")[0]}
                        name={field.name}
                        disabled={isBlocked}
                        placeholder={
                          "placeholderText" in field
                            ? (field?.placeholderText as unknown as string)
                            : ""
                        }
                        value={
                          formData[field.name] ??
                          ("defaultValue" in field ? field.defaultValue : "")
                        }
                        onChange={(e) => {
                          let value = e.target.value;
                          if (field.type === "number") {
                            if (value === "" || Number(value) >= 0) {
                              setFormData({
                                ...formData,
                                [field.name]: value,
                              });
                            }
                          } else {
                            handleInputChange(e);
                          }
                        }}
                      />
                    )}
                </FormControl>
              </GridItem>
            ))}
        </Grid>
      )}
    </Box>
  );
};

export default CreateTestFormInputContainer;

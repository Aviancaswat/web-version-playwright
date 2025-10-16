import { Box, HStack, Select, Text } from "@chakra-ui/react";

//Types
import type { Option } from "../CreateTestFormComponent/CreateTestFormComponent.types";
import type { MultiselectWithTagComponentProps } from "./MultiselectWithTagComponent.types";

const MultiselectWithTagComponent: React.FC<
  MultiselectWithTagComponentProps
> = ({ formData, field, setFormData, isBlocked }) => {
  return (
    <Box>
      {(() => {
        const rawValue = formData[field.name];

        const currentValues: string[] = (() => {
          if (typeof rawValue === "string") {
            return rawValue.split(",").filter(Boolean);
          }

          if (Array.isArray(rawValue)) {
            return rawValue as string[];
          }

          return [];
        })();

        return (
          <>
            {currentValues.length > 0 && (
              <HStack wrap="wrap" mb={2}>
                {currentValues.map((language) => {
                  const option = field.option?.find(
                    (option) => option.value === language
                  );

                  return (
                    <Box
                      key={language}
                      bg="gray.200"
                      color="gray.800"
                      px={3}
                      py={1}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      gap={2}
                      fontSize="sm"
                    >
                      <Text>{option?.label ?? language}</Text>
                      <Box
                        as="button"
                        onClick={() => {
                          const updatedValues = currentValues.filter(
                            (v) => v !== language
                          );

                          setFormData(
                            (prev: Record<string, string | number>) => ({
                              ...prev,
                              [field.name]: updatedValues.join(","),
                            })
                          );
                        }}
                        _hover={{ color: "red.500" }}
                      >
                        ×
                      </Box>
                    </Box>
                  );
                })}
              </HStack>
            )}
            <Select
              name={field.name}
              placeholder="Selecciona idioma(s)"
              value=""
              onChange={(e) => {
                const newValue = e.target.value;

                if (newValue && !currentValues.includes(newValue)) {
                  const updatedValues = [...currentValues, newValue];

                  setFormData((prev: Record<string, string | number>) => ({
                    ...prev,
                    [field.name]: updatedValues.join(","),
                  }));
                }
              }}
              disabled={isBlocked}
            >
              {field.option
                ?.filter(
                  (option) => !currentValues.includes(option.value as string)
                )
                .map((option: Option, i: number) => (
                  <option key={i} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </Select>
          </>
        );
      })()}
    </Box>
  );
};

export default MultiselectWithTagComponent;

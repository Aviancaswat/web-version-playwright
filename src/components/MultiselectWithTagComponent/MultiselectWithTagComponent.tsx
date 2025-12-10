import { Box, HStack, Select, Text } from "@chakra-ui/react";

//Types
import type { MultiselectWithTagComponentProps } from "./MultiselectWithTagComponent.types";

const MultiselectWithTagComponent: React.FC<
  MultiselectWithTagComponentProps
> = ({ formData, field, setFormData, isBlocked }) => {
  return (
    <Box>
      {(() => {
        const rawValue = formData[field.name];

        const currentValues: string[] = Array.isArray(rawValue)
          ? rawValue
          : typeof rawValue === "string"
          ? rawValue.split(",").filter(Boolean)
          : [];

        const removeValue = (value: string) => {
          const updatedValues = currentValues.filter((currentValue) => currentValue !== value);
          setFormData((prev: any) => ({
            ...prev,
            [field.name]: updatedValues.join(","),
          }));
        };

        const addValue = (value: string) => {
          if (!value || currentValues.includes(value)) return;

          const updatedValues = [...currentValues, value];
          setFormData((prev: any) => ({
            ...prev,
            [field.name]: updatedValues.join(","),
          }));
        };

        return (
          <>
            {currentValues.length > 0 && (
              <HStack wrap="wrap" mb={2}>
                {currentValues.map((value) => {
                  const option = field.option?.find(
                    (option) => option.value === value
                  );

                  return (
                    <Box
                      key={value}
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
                      <Text>{option?.label ?? value}</Text>

                      <Box
                        as="button"
                        onClick={() => removeValue(value)}
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
              onChange={(e) => addValue(e.target.value)}
              disabled={isBlocked}
            >
              {field.option
                ?.filter((option) => !currentValues.includes(option.value as string))
                .map((option, index) => (
                  <option key={index} value={option.value}>
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

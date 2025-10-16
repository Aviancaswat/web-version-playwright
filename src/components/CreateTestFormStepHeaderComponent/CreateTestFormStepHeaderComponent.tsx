import { Box, Circle, Divider, HStack, Text } from "@chakra-ui/react";

//Types
import type { CreateTestFormStepHeaderComponentProps } from "./CreateTestFormStepHeaderComponent.types";

const CreateTestFormStepHeaderComponent: React.FC<
  CreateTestFormStepHeaderComponentProps
> = ({ steps, stepFields, stepRefs, currentStep }) => {
  return (
    <Box
      overflowX="auto"
      mb={8}
      sx={{
        "&::-webkit-scrollbar": { display: "none" },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
    >
      <HStack spacing={6} justify="flex-start" minW="max-content">
        {steps.map((stepKey, index) => {
          const step = stepFields.find((step) => step.key === stepKey);

          return (
            <HStack
              key={stepKey}
              ref={(element) => {
                if (element) stepRefs.current[index] = element;
              }}
            >
              <Circle
                size="26px"
                bg={index === currentStep ? "#FF0000" : "gray.300"}
                color="white"
                fontWeight="bold"
              >
                {index + 1}
              </Circle>
              <Text
                fontSize="sm"
                fontWeight={index === currentStep ? "bold" : "normal"}
              >
                {step?.stepTitle}
              </Text>
              {index < steps.length - 1 && (
                <Divider borderColor="gray.400" w="40px" />
              )}
            </HStack>
          );
        })}
      </HStack>
    </Box>
  );
};

export default CreateTestFormStepHeaderComponent;

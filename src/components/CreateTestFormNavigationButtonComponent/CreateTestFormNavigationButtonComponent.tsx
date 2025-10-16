import { Button, ButtonGroup } from "@chakra-ui/react";

//Types
import type { CreateTestFormNavigationButtonComponentProps } from "./CreateTestFormNavigationButtonComponent.types";

const CreateTestFormNavigationButtonComponent: React.FC<
  CreateTestFormNavigationButtonComponentProps
> = ({
  currentStep,
  prevStep,
  nextStep,
  editTest,
  formData,
  steps,
  generateDefaultDataByStep,
  transformFormDataToTest,
  handleCreateTestsByLanguages,
  setFormData,
  setDependentFieldOption,
  setSteps,
  setCurrentStep,
  initializeFormData,
  isStepComplete,
  handleSave,
}) => {
  return (
    <ButtonGroup justifyContent="space-between" mt="auto" pt={4} w="100%">
      {currentStep > 0 && (
        <Button
          onClick={prevStep}
          backgroundColor="#ffffff"
          border="2px solid #1b1b1b"
          color="#1b1b1b"
          borderRadius="full"
          _hover={{
            backgroundColor: "#1b1b1b",
            color: "#ffffff",
            borderColor: "#1b1b1b",
          }}
        >
          Atrás
        </Button>
      )}
      {!editTest &&
        formData.targetPage !== "home" &&
        steps[currentStep] === 1 && (
          <Button
            onClick={() => {
              const defaults = generateDefaultDataByStep(formData);

              const combinedData = { ...formData, ...defaults };

              const finalTest = transformFormDataToTest(combinedData);

              handleCreateTestsByLanguages(finalTest);

              setFormData(initializeFormData());
              setDependentFieldOption({});
              setSteps([0]);
              setCurrentStep(0);
            }}
            colorScheme="blackAlpha"
            backgroundColor="#1b1b1b"
            borderRadius="full"
            isDisabled={!isStepComplete(1)}
          >
            Crear prueba automática
          </Button>
        )}

      {currentStep < steps.length - 1 ? (
        <Button
          onClick={nextStep}
          colorScheme="black"
          backgroundColor="#1b1b1b"
          isDisabled={!isStepComplete(steps[currentStep])}
          borderRadius="full"
        >
          Siguiente
        </Button>
      ) : (
        currentStep !== 0 && (
          <Button
            onClick={handleSave}
            colorScheme="blackAlpha"
            backgroundColor="#1b1b1b"
            borderRadius="full"
            isDisabled={!isStepComplete(steps[currentStep])}
          >
            {editTest ? "Actualizar prueba" : "Crear prueba"}
          </Button>
        )
      )}
    </ButtonGroup>
  );
};

export default CreateTestFormNavigationButtonComponent;

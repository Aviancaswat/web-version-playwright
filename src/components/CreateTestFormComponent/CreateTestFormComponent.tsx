import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Select,
  Input,
  FormControl,
  FormLabel,
  HStack,
  Circle,
  Text,
  Divider,
  Grid,
  GridItem,
} from "@chakra-ui/react";

//Data
import stepFields from "../../json/CreateTestForm/inputData.json";

//Store
import useTestStore from "../../store/useTestStore";

//Components
import SearchableSelectComponent from "../SearchableSelectComponent/SearchableSelectComponent";

//Types
import type { InputTypes, Option } from "./CreateTestFormComponent.types";

//TODO: Cuando seleccione pasajeros o flujo superior en el paso de pasajeros, mostrar texto explicativo: "El formulario se va rellenar."
//TODO: Mostrar mensaje en paso de asientos: "Se va seleccionar un asiento al azar."
//TODO: en paso de payment, mostrar un mensaje: "Se ejecuta un pago al azar."

const CreateTestFormComponent: React.FC = () => {
  const addTest = useTestStore((state) => state.addTest);

  const [steps, setSteps] = useState<number[]>([0]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [dependentFieldOption, setDependentFieldOption] = useState<
    Record<string, Option[]>
  >({});

  const initializeFormData = () => {
    const initialData: { [key: string]: string | number } = {};

    stepFields.forEach((step) => {
      step.input.map((field) => {
        if ((field as InputTypes).hasDefaultValue) {
          initialData[field.name] = (field as InputTypes).defaultValue ?? "";
        }
      });
    });

    return initialData;
  };

  const [formData, setFormData] = useState(initializeFormData);

  const stepRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (stepRefs.current[currentStep]) {
      stepRefs.current[currentStep].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentStep]);

  useEffect(() => {
    stepFields.forEach((step) => {
      step.input.forEach((field) => {
        if ("showIf" in field) {
          const inputField = field as InputTypes;

          const dependencyValue = formData[inputField.showIf?.field ?? ""];

          if (
            dependencyValue !== inputField.showIf?.equals &&
            formData[inputField.name] !== undefined
          ) {
            setFormData((prev) => {
              const newData = { ...prev };
              delete newData[field.name];
              return newData;
            });
          }
        }
      });
    });
  }, [formData.homeisActiveOptionOutbound]);

  const getMethodOptionsByStep = (targetKey: number) => {
    let accumulatedOptions: Option[] = [];

    for (let i = 1; i <= targetKey; i++) {
      const step = stepFields.find((step) => step.key === i);

      if (step?.method) {
        accumulatedOptions = [...accumulatedOptions, ...step.method];
      }
    }

    return accumulatedOptions;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (steps[currentStep] === 0 && e.target.name === "targetPage") {
      const targetPageField = stepFields!.find((step) => step.key === 0);
      const targetPageInput = targetPageField?.input;
      const targetPageInputField = targetPageInput?.find(
        (field) => field.name === "targetPage"
      );

      const selectedOption = targetPageInputField?.option?.find(
        (option) => option.value === e.target.value
      );

      if (selectedOption && "stepKey" in selectedOption) {
        const targetKey = selectedOption.stepKey as number;

        const newTargetMethodOptions = getMethodOptionsByStep(targetKey);

        setDependentFieldOption({
          ...dependentFieldOption,
          targetMethod: newTargetMethodOptions,
        });

        const newSteps = stepFields
          .filter((step) => step.key <= targetKey)
          .map((step) => step.key);

        setSteps(newSteps);
        setCurrentStep(0);
      }
    }
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleSave = () => {
    const transformedData = { ...formData };

    stepFields.forEach((step) => {
      step.input.forEach((field) => {
        if (field.type === "date" && transformedData[field.name]) {
          transformedData[field.name] = formatDate(transformedData[field.name]);
        }

        if (field.type === "number" && transformedData[field.name]) {
          transformedData[field.name] = parseInt(
            transformedData[field.name].toString()
          );
        }
      });
    });

    addTest(transformedData);
    setFormData(initializeFormData);
    setDependentFieldOption({});
    setSteps([0]);
    setCurrentStep(0);
  };

  const currentStepFields =
    stepFields.find((step) => step.key === steps[currentStep])?.input || [];

  const isStepComplete = (stepKey: Option["stepKey"]) => {
    const step = stepFields.find((step) => step.key === stepKey);

    if (!step) return false;

    return step.input.every((field) => {
      if ("showIf" in field) {
        const dependencyValue =
          field.showIf?.field && formData[field.showIf?.field];

        if (dependencyValue !== field.showIf?.equals) {
          return true;
        }
      }

      if (!field.isRequired) return true;

      const value = formData[field.name];

      if (value === undefined || value === null) return false;
      if (typeof value === "string") return value.trim() !== "";

      return true;
    });
  };

  const shouldShowField = (field: any) => {
    if (!field.showIf) return true;

    const dependencyValue = field.showIf.field && formData[field.showIf.field];

    return dependencyValue === field.showIf.equals;
  };

  const formatDate = (dateString: string | number) => {
    if (!dateString) return "";

    const [, month, day] = dateString.toString().split("-");

    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];

    return `${months[Number(month) - 1]} ${Number(day)}`;
  };

  return (
    <Box
      maxW="500px"
      w="100%"
      mx="auto"
      mt={2}
      p={5}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
      display="flex"
      flexDirection="column"
      h="100%"
    >
      {/* Header/Stepper (no scroll) */}
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
                ref={(element) => { if (element) stepRefs.current[index] = element; }}
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

      {/* Zona scrollable para campos */}
      <Box flex="1 1 auto" minH={0} maxH="100%" overflowY="auto" pr={1}>
        <Grid templateColumns="repeat(2, 1fr)" alignItems="end" gap={4}>
          {currentStepFields
            .filter((field) => shouldShowField(field))
            .map((field, index, array) => (
              <GridItem
                key={field.name}
                colSpan={array.length % 2 !== 0 && index === array.length - 1 ? 2 : 1}
              >
                <FormControl isRequired={field.isRequired}>
                  <FormLabel>{field.label}</FormLabel>

                  {field.type === "select" && (
                    <Select
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                    >
                      <option value="">Selecciona una opción</option>
                      {(dependentFieldOption[field.name] || field.option || []).map(
                        (option: Option, i: number) => (
                          <option key={i} value={option.value}>
                            {option.label}
                          </option>
                        )
                      )}
                    </Select>
                  )}

                  {field.type === "searchable-select" && field.option && (
                    <SearchableSelectComponent
                      options={field.option}
                      value={formData[field.name] || ""}
                      onChange={(val) =>
                        setFormData((prev) => ({ ...prev, [field.name]: val }))
                      }
                    />
                  )}

                  {field.type !== "select" && field.type !== "searchable-select" && (
                    <Input
                      type={field.type}
                      name={field.name}
                      placeholder={
                        "placeholderText" in field ? field?.placeholderText : ""
                      }
                      value={
                        formData[field.name] ??
                        ("defaultValue" in field ? field.defaultValue : "")
                      }
                      onChange={(e) => {
                        let value = e.target.value;
                        if (field.type === "number") {
                          if (value === "" || Number(value) >= 0) {
                            setFormData((prev) => ({
                              ...prev,
                              [field.name]: value,
                            }));
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
      </Box>

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
              Crear prueba
            </Button>
          )
        )}
      </ButtonGroup>
    </Box>

  );
};

export default CreateTestFormComponent;

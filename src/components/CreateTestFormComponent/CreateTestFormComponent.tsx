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

//TODO: Refactorizar codigo
//TODO: Cambiar diseño de los botontes por los de la pagina de avianca
//TODO: Cuando seleccione pasajeros o flujo superior en el paso de pasajeros, mostrar texto explicativo: "El formulario se va rellenar."
//TODO: Mostrar mensaje en paso de asientos: "Se va seleccionar un asiento al azar."
//TODO: en paso de payment, mostrar un mensaje: "Se ejecuta un pago al azar."
//TODO: HACER CAMPSO DE SELECCION ORIGEN Y DESTINO en selector con buscador interno Medellin - MDE
//TODO: Camibiar nombre de los pasos: home, booking, etc.
//TODO: hacer que todos los labels queden una sola linea

interface Input {
  name: string;
  label: string;
  type: "select" | "text" | "date" | "number";
  isRequired: boolean;
  hasPlaceholder?: boolean;
  hasDefaultValue?: boolean;
  defaultValue?: string | number;
  option?: { value: string | number; label: string }[];
  showIf?: {
    field?: string;
    equals?: string;
  };
}

interface Step {
  key: number;
  stepTitle: string;
  input: Input[];
}

const CreateTestFormComponent: React.FC = () => {
  const addTest = useTestStore((state) => state.addTest);

  const [steps, setSteps] = useState<number[]>([0]);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const initializeFormData = () => {
    const initialData: { [key: string]: string | number } = {};

    stepFields.forEach((step) => {
      step.input.map((field) => {
        if ((field as Input).hasDefaultValue) {
          initialData[field.name] = (field as Input).defaultValue ?? "";
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
          const inputField = field as Input;

          const dependencyValue = formData[inputField.showIf?.field ?? ""];

          if (
            dependencyValue !== inputField.showIf.equals &&
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

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (steps[currentStep] === 0 && e.target.name === "targetPage") {
      const targetPageField = stepFields
        .find((step) => step.key === 0)
        .input.find((field) => field.name === "targetPage");

      const selectedOption = targetPageField.option.find(
        (option) => option.value === e.target.value
      );

      if (selectedOption) {
        const targetKey = selectedOption.stepKey;
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
          transformedData[field.name] = parseInt(transformedData[field.name]);
        }
      });
    });

    //FIXME: Cuando se ingresa un valor en campso de numero, se guarda como string.

    addTest(transformedData);
    setFormData(initializeFormData);
    setSteps([0]);
    setCurrentStep(0);
  };

  const currentStepFields =
    stepFields.find((step) => step.key === steps[currentStep])?.input || [];

  const isStepComplete = (stepKey) => {
    const step = stepFields.find((step) => step.key === stepKey);
    if (!step) return false;

    return step.input.every((field) => {
      if (field.showIf) {
        const dependencyValue = formData[field.showIf.field];
        if (dependencyValue !== field.showIf.equals) {
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

  const shouldShowField = (field) => {
    if (!field.showIf) return true;

    const dependencyValue = formData[field.showIf.field];

    return dependencyValue === field.showIf.equals;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const [, month, day] = dateString.split("-");
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
      mt={10}
      p={5}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
    >
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
                ref={(element) => (stepRefs.current[index] = element)}
              >
                <Circle
                  size="32px"
                  bg={index === currentStep ? "#23C847" : "gray.300"}
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

      <Grid templateColumns="repeat(2, 1fr)" alignItems={"end"} gap={4}>
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
                {field.type === "select" ? (
                  <Select
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecciona una opción</option>
                    {field.option.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    type={field.type}
                    name={field.name}
                    placeholder={
                      field.hasPlaceholder ? field.placeholderText : ""
                    }
                    value={
                      formData[field.name] ??
                      (field.hasDefaultValue ? field.defaultValue : "")
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

      <ButtonGroup justifyContent="space-between" mt={6} w="100%">
        {currentStep > 0 && (
          <Button
            onClick={prevStep}
            backgroundColor={"#ffffff"}
            border={"2px solid #1b1b1b"}
            color={"#1b1b1b"}
            borderRadius={"full"}
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
            backgroundColor={"#1b1b1b"}
            isDisabled={!isStepComplete(steps[currentStep])}
            borderRadius={"full"}
          >
            Siguiente
          </Button>
        ) : (
          currentStep !== 0 && (
            <Button
              onClick={handleSave}
              colorScheme="blackAlpha"
              backgroundColor={"#1b1b1b"}
              borderRadius={"full"}
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

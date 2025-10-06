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
import useTestStore from "../../store/useTestStore/useTestStore";
import useEditTestStore from "../../store/useEditTestStore/useEditTestStore";

//Components
import SearchableSelectComponent from "../SearchableSelectComponent/SearchableSelectComponent";

//Types
import type { InputTypes, Option } from "./CreateTestFormComponent.types";

//TODO: Quitar persistencia en session storage
//TODO: Agregar campos para el flujo de servicios

const CreateTestFormComponent: React.FC = () => {
  const { addTest, isBlocked, updateTest } = useTestStore();
  const { editTest, testIndexToEdit, cleanEditTest } = useEditTestStore();

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
    if (editTest) {
      const updatedData: typeof formData = { ...editTest };

      Object.entries(editTest).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          const isActive = Object.values(value).some((value) => {
            if (typeof value === "boolean") return value === true;
            if (typeof value === "number") return value > 0;
            if (typeof value === "string")
              return value.trim() !== "" && value !== "false";
            return false;
          });

          updatedData[key] = String(isActive);

          Object.entries(value).forEach(([innerKey, innerValue]) => {
            updatedData[innerKey] = String(innerValue);
          });
        } else if (typeof value === "boolean" || typeof value === "number") {
          updatedData[key] = String(value);
        }
      });

      stepFields.forEach((step) => {
        step.input.forEach((field) => {
          if (field.type === "date" && updatedData[field.name]) {
            updatedData[field.name] =
              formatDate(updatedData[field.name], "yyyy-mm-dd") ?? "";
          }
        });
      });

      setFormData(updatedData);

      if (editTest.targetPage) {
        applyTargetPageFunction(editTest.targetPage);
      }
    }
  }, [editTest]);

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

  const applyTargetPageFunction = (targetPage: string) => {
    const targetPageField = stepFields!.find((step) => step.key === 0);
    const targetPageInput = targetPageField?.input;
    const targetPageInputField = targetPageInput?.find(
      (field) => field.name === "targetPage"
    );

    const selectedOption = targetPageInputField?.option?.find(
      (option) => option.value === targetPage
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
  };

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
      applyTargetPageFunction(e.target.value);
    }
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleSave = () => {
    const transformedData = { ...formData };

    stepFields.forEach((step) => {
      step.input.forEach((field) => {
        if (field.type === "date" && transformedData[field.name]) {
          transformedData[field.name] =
            formatDate(transformedData[field.name], "mm-dd") ?? "";
        }

        if (field.type === "number" && transformedData[field.name]) {
          transformedData[field.name] = parseInt(
            transformedData[field.name].toString()
          );
        }
      });
    });

    const serviceGroups: Record<string, string[]> = {
      servicesEquipajeManoBodega: [
        "servicesEquipajeManoIda",
        "servicesEquipajeManoVuelta",
        "servicesEquipajeBodegaIda",
        "servicesEquipajeBodegaVuelta",
      ],
      servicesEquipajeDeportivo: [
        "servicesDeportivoBicicletaIda",
        "servicesDeportivoBicicletaVuelta",
        "servicesDeportivoGolfIda",
        "servicesDeportivoGolfVuelta",
        "servicesDeportivoBuceoIda",
        "servicesDeportivoBuceoVuelta",
        "servicesDeportivoSurfIda",
        "servicesDeportivoSurfVuelta",
        "servicesDeportivoEsquiarIda",
        "servicesDeportivoEsquiarVuelta",
      ],
      servicesAbordajePrioritario: [
        "servicesAbordajePrioritarioIda",
        "servicesAbordajePrioritarioVuelta",
      ],
      servicesAviancaLounges: [
        "servicesLoungesPrioritarioIda",
        "servicesLoungesPrioritarioVuelta",
      ],
      servicesAsistenciaEspecial: [
        "servicesAsistenciaDiscapacidadVisualIda",
        "servicesAsistenciaDiscapacidadVisualVuelta",
        "servicesAsistenciaDiscapacidadAuditivaIda",
        "servicesAsistenciaDiscapacidadAuditivaVuelta",
        "servicesAsistenciaDiscapacidadIntelectualIda",
        "servicesAsistenciaDiscapacidadIntelectualVuelta",
        "servicesAsistenciaPerroServicioIda",
        "servicesAsistenciaPerroServicioVuelta",
        "servicesAsistenciaDiscapacidadFisicaIda",
        "servicesAsistenciaDiscapacidadFisicaVuelta",
      ],
    };

    const services: Record<string, any> = {};

    Object.entries(serviceGroups).forEach(([mainKey, children]) => {
      if (transformedData[mainKey] === "true") {
        const nested: Record<string, any> = {};

        children.forEach((child) => {
          if (child in transformedData) {
            const value = transformedData[child];
            if (value === "true" || value === "false") {
              nested[child] = value === "true";
            } else if (!isNaN(Number(value))) {
              nested[child] = Number(value);
            } else {
              nested[child] = value;
            }
            delete transformedData[child];
          }
        });
        services[mainKey] = nested;
      }
    });

    if (transformedData.servicesAsistenciaViaje) {
      services.servicesAsistenciaViaje =
        transformedData.servicesAsistenciaViaje === "true";

      delete transformedData.servicesAsistenciaViaje;
    }

    Object.assign(transformedData, services);

    if (editTest && testIndexToEdit !== null) {
      updateTest(testIndexToEdit, transformedData);
      cleanEditTest();
    } else {
      addTest(transformedData);
    }

    setFormData(initializeFormData);
    setDependentFieldOption({});
    setSteps([0]);
    setCurrentStep(0);
  };

  const currentStepConfig = stepFields.find(
    (step) => step.key === steps[currentStep]
  );

  const currentStepFields = currentStepConfig?.input || [];

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
      if (typeof value === "string" && value.trim() === "") return false;

      if (field.name === "homeFechaSalida") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [year, month, day] = (value as string).split("-").map(Number);

        const departureDate = new Date(year, month - 1, day);

        if (departureDate < today) return false;
      }

      if (field.name === "homeFechaLlegada") {
        const departureDate = new Date(formData["homeFechaSalida"]);
        const returnDate = new Date(value);

        if (returnDate <= departureDate) return false;
      }

      return true;
    });
  };

  const shouldShowField = (field: any) => {
    if (!field.showIf) return true;

    const dependencyValue = field.showIf.field && formData[field.showIf.field];

    return dependencyValue === field.showIf.equals;
  };

  const formatDate = (dateString: string | number, typeFormat: string) => {
    if (!dateString) return "";

    if (typeFormat === "mm-dd") {
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

      return `${months[Number(month) - 1]} ${Number(day)} `;
    }

    if (typeFormat === "yyyy-mm-dd") {
      const months: Record<string, string> = {
        jan: "01",
        feb: "02",
        mar: "03",
        apr: "04",
        may: "05",
        jun: "06",
        jul: "07",
        aug: "08",
        sep: "09",
        oct: "10",
        nov: "11",
        dec: "12",
      };

      const [mon, dayStr] = (dateString as string).split(" ");
      const day = String(dayStr).padStart(2, "0");
      const today = new Date();
      const year = today.getFullYear();

      let candidate = new Date(`${year}-${months[mon.toLowerCase()]}-${day}`);

      if (candidate < today) {
        candidate.setFullYear(year + 1);
      }

      return candidate.toISOString().split("T")[0];
    }
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
                      <Select
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleInputChange}
                        disabled={isBlocked}
                      >
                        <option value="">Selecciona una opción</option>
                        {(
                          dependentFieldOption[field.name] ||
                          field.option ||
                          []
                        ).map((option: Option, i: number) => (
                          <option key={i} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
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
                          setFormData((prev) => ({
                            ...prev,
                            [field.name]: val,
                          }))
                        }
                      />
                    )}

                    {field.type !== "select" &&
                      field.type !== "searchable-select" && (
                        <Input
                          type={field.type}
                          min={new Date().toISOString().split("T")[0]}
                          name={field.name}
                          disabled={isBlocked}
                          placeholder={
                            "placeholderText" in field
                              ? field?.placeholderText
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
        )}
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
              {editTest ? "Actualizar prueba" : "Crear prueba"}
            </Button>
          )
        )}
      </ButtonGroup>
    </Box>
  );
};

export default CreateTestFormComponent;

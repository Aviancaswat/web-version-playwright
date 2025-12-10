import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Select,
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
  const generatePassengerList = (formData: any) => {
    const passengers: any[] = [];

    const groups = [
      { count: formData.homePassengerAdults, label: "Adulto", type: "adult" },
      { count: formData.homePassengerYouths, label: "Joven", type: "youth" },
      { count: formData.homePassengerChildren, label: "Niño", type: "child" },
      { count: formData.homePassengerInfant, label: "Bebé", type: "infant" },
    ];

    groups.forEach((group) => {
      for (let index = 1; index <= (Number(group.count) || 0); index++) {
        passengers.push({
          id: `${group.type}-${index}`,
          title: `${group.label} ${index}`,
        });
      }
    });

    return passengers;
  };

  const generatePassengerFullNames = () => {
    return generatePassengerList(formData)
      .map((p) => {
        const name = formData[`${p.id}_passengerName`] || "";
        const last = formData[`${p.id}_passengerLastName`] || "";

        if (!name && !last) return null;

        return {
          id: p.id,
          fullName: `${name} ${last}`.trim(),
        };
      })
      .filter(Boolean);
  };

  const passengerInputs = [
    {
      name: "passengerGenre",
      label: "Género:",
      type: "select",
      isRequired: true,
      option: [
        { value: "", label: "--Selecciona--" },
        { value: "male", label: "Masculino" },
        { value: "female", label: "Femenino" },
        { value: "other", label: "Otro" },
      ],
    },
    {
      name: "passengerName",
      label: "Nombre de pasajero:",
      type: "text",
      isRequired: true,
    },
    {
      name: "passengerLastName",
      label: "Apellido(s) de pasajero:",
      type: "text",
      isRequired: true,
    },
    {
      name: "passengerBirthdate",
      label: "Fecha de nacimiento de pasajero:",
      type: "date",
      isRequired: true,
    },
    {
      name: "passengerNationality",
      label: "Nacionalidad documento de pasajero:",
      type: "select",
      isRequired: true,
      option: [
        { value: "", label: "--Selecciona--" },
        { value: "CO", label: "Colombia" },
      ],
    },
    {
      name: "passengerFrequentFlyerProgram",
      label: "Programa viajero frecuente:",
      type: "select",
      isRequired: true,
      option: [
        { value: "", label: "--Selecciona--" },
        { value: "none", label: "No aplica" },
        { value: "lifemiles", label: "Lifemiles" },
        { value: "aeroplan", label: "Aeroplan" },
        { value: "airindia", label: "Air India - Maharaja Club" },
      ],
    },
    {
      name: "passengerNumberFrequentFlyerProgram",
      label: "Número de viajero frecuente:",
      type: "text",
      isRequired: true,
      showIf: {
        field: "passengerFrequentFlyerProgram",
        noEquals: "none",
      },
    },
  ];

  return (
    <Box
      flex="1 1 auto"
      minH={0}
      maxH="100%"
      overflowY="auto"
      pr={2}
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
      p={6}
    >
      {currentStepConfig.key === 3 && (
        <Box>
          <Accordion allowToggle>
            {generatePassengerList(formData).map((p) => (
              <AccordionItem
                key={p.id}
                border="1px solid #ddd"
                borderRadius="md"
                mb={4}
              >
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      {p.title}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>

                <AccordionPanel>
                  <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                    {passengerInputs.map((field: any) => {
                      if (field.showIf) {
                        const fieldToCheck = `${p.id}_${field.showIf.field}`;
                        const expectedValue = field.showIf.noEquals;

                        if (formData[fieldToCheck] === expectedValue) {
                          return null;
                        }
                      }

                      return (
                        <GridItem key={`${p.id}-${field.name}`}>
                          <FormControl isRequired={field.isRequired}>
                            <FormLabel fontSize="sm">{field.label}</FormLabel>
                            {field.type === "select" && (
                              <Select
                                value={formData[`${p.id}_${field.name}`] || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    [`${p.id}_${field.name}`]: e.target.value,
                                  })
                                }
                              >
                                {field.option.map((op) => (
                                  <option key={op.value} value={op.value}>
                                    {op.label}
                                  </option>
                                ))}
                              </Select>
                            )}
                            {field.type !== "select" && (
                              <Input
                                type={field.type}
                                value={formData[`${p.id}_${field.name}`] || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    [`${p.id}_${field.name}`]: e.target.value,
                                  })
                                }
                              />
                            )}
                          </FormControl>
                        </GridItem>
                      );
                    })}
                  </Grid>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      )}

      {currentStepConfig?.hasOnlyText ? (
        <Text
          fontSize="md"
          textAlign="center"
          color="gray.600"
          p={4}
          lineHeight="1.6"
        >
          {currentStepConfig.infoText}
        </Text>
      ) : (
        <Grid templateColumns="repeat(2, 1fr)" gap={6} alignItems="flex-end">
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
                  <FormLabel
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    mb={1}
                  >
                    {field.label}
                  </FormLabel>

                  {field.type === "select" &&
                    (field.name === "passengerBookingHolder" ? (
                      (() => {
                        const passengers = generatePassengerFullNames();

                        return (
                          <Select
                            value={formData[field.name] || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [field.name]: e.target.value,
                              })
                            }
                          >
                            <option value="">Seleccione titular</option>

                            {passengers.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.fullName}
                              </option>
                            ))}
                          </Select>
                        );
                      })()
                    ) : (
                      <SelectComponent
                        field={field}
                        formData={formData}
                        handleInputChange={handleInputChange}
                        isBlocked={isBlocked}
                        dependentFieldOption={dependentFieldOption}
                      />
                    ))}

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
                            ? (field.placeholderText as string)
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
                        bg="white"
                        border="1px solid"
                        borderColor="gray.300"
                        _focus={{
                          borderColor: "blue.500",
                          bg: "white",
                          boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                        }}
                        borderRadius="md"
                        py={2}
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

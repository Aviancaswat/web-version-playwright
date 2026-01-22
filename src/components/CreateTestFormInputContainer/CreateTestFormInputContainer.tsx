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
import type { Option } from "../CreateTestFormComponent/CreateTestFormComponent.types";
import { generatePassengerList } from "@/utils/generatePassenger";

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
  const generatePassengerListToSelect = () => {
    return generatePassengerList(formData)
      .map((passenger) => {
        const name = formData[`${passenger.id}_passengerName`] || "";
        const lastName = formData[`${passenger.id}_passengerLastName`] || "";

        if (!name && !lastName) return null;

        return {
          id: passenger.id,
          fullName: `${name} ${lastName}`,
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
        { value: "AF", label: "Afganistán" },
        { value: "AL", label: "Albania" },
        { value: "DE", label: "Alemania" },
        { value: "AD", label: "Andorra" },
        { value: "AO", label: "Angola" },
        { value: "AG", label: "Antigua y Barbuda" },
        { value: "SA", label: "Arabia Saudita" },
        { value: "DZ", label: "Argelia" },
        { value: "AR", label: "Argentina" },
        { value: "AM", label: "Armenia" },
        { value: "AU", label: "Australia" },
        { value: "AT", label: "Austria" },
        { value: "AZ", label: "Azerbaiyán" },
        { value: "BS", label: "Bahamas" },
        { value: "BD", label: "Bangladés" },
        { value: "BB", label: "Barbados" },
        { value: "BE", label: "Bélgica" },
        { value: "BZ", label: "Belice" },
        { value: "BO", label: "Bolivia" },
        { value: "BR", label: "Brasil" },
        { value: "BG", label: "Bulgaria" },
        { value: "CA", label: "Canadá" },
        { value: "CL", label: "Chile" },
        { value: "CN", label: "China" },
        { value: "CY", label: "Chipre" },
        { value: "KR", label: "Corea del Sur" },
        { value: "CR", label: "Costa Rica" },
        { value: "HR", label: "Croacia" },
        { value: "CU", label: "Cuba" },
        { value: "DK", label: "Dinamarca" },
        { value: "DM", label: "Dominica" },
        { value: "EC", label: "Ecuador" },
        { value: "EG", label: "Egipto" },
        { value: "SV", label: "El Salvador" },
        { value: "AE", label: "Emiratos Árabes Unidos" },
        { value: "SK", label: "Eslovaquia" },
        { value: "SI", label: "Eslovenia" },
        { value: "ES", label: "España" },
        { value: "US", label: "Estados Unidos" },
        { value: "EE", label: "Estonia" },
        { value: "PH", label: "Filipinas" },
        { value: "FI", label: "Finlandia" },
        { value: "FR", label: "Francia" },
        { value: "GE", label: "Georgia" },
        { value: "GH", label: "Ghana" },
        { value: "GR", label: "Grecia" },
        { value: "GT", label: "Guatemala" },
        { value: "HT", label: "Haití" },
        { value: "HN", label: "Honduras" },
        { value: "HU", label: "Hungría" },
        { value: "IN", label: "India" },
        { value: "ID", label: "Indonesia" },
        { value: "IE", label: "Irlanda" },
        { value: "IS", label: "Islandia" },
        { value: "IL", label: "Israel" },
        { value: "IT", label: "Italia" },
        { value: "JM", label: "Jamaica" },
        { value: "JP", label: "Japón" },
        { value: "LV", label: "Letonia" },
        { value: "LT", label: "Lituania" },
        { value: "LU", label: "Luxemburgo" },
        { value: "MY", label: "Malasia" },
        { value: "MA", label: "Marruecos" },
        { value: "MX", label: "México" },
        { value: "NP", label: "Nepal" },
        { value: "NI", label: "Nicaragua" },
        { value: "NO", label: "Noruega" },
        { value: "NZ", label: "Nueva Zelanda" },
        { value: "PA", label: "Panamá" },
        { value: "PY", label: "Paraguay" },
        { value: "NL", label: "Países Bajos" },
        { value: "PE", label: "Perú" },
        { value: "PL", label: "Polonia" },
        { value: "PT", label: "Portugal" },
        { value: "GB", label: "Reino Unido" },
        { value: "DO", label: "República Dominicana" },
        { value: "RO", label: "Rumanía" },
        { value: "SE", label: "Suecia" },
        { value: "CH", label: "Suiza" },
        { value: "TH", label: "Tailandia" },
        { value: "TR", label: "Turquía" },
        { value: "UA", label: "Ucrania" },
        { value: "UY", label: "Uruguay" },
        { value: "VE", label: "Venezuela" },
        { value: "VN", label: "Vietnam" },
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
        { value: "airpoints", label: "AirPoints" },
        { value: "ana_milage_club", label: "ANA Mileage Club" },
        { value: "asiana_club", label: "Asiana Club" },
        { value: "connect_miles", label: "Connect Miles" },
        { value: "euro_bonus", label: "Euro Bonus" },
        { value: "iberia_plus", label: "Iberia Plus" },
        { value: "inifinity_mileagelands", label: "Infinity MileageLands" },
        { value: "krisflyer", label: "KrisFlyer" },
        { value: "mileage_plus", label: "Mileage Plus" },
        { value: "miles_bonus", label: "Miles&Bonus" },
        { value: "miles_go", label: "Miles&Go" },
        { value: "miles_more", label: "Miles&More" },
        { value: "miles_smiles", label: "Miles&Smiles" },
        { value: "phoenix_miles", label: "Phoenix Miles" },
        { value: "sheba_miles", label: "Sheba Miles" },
        { value: "smiles", label: "Smiles" },
        { value: "voyager", label: "Voyager" },
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

  const seatInputs = [
    {
      name: "seatNumberDeparture",
      label: "Número de asiento de ida:",
      type: "select",
      isRequired: true,
      option: [
        { value: "", label: "--Selecciona--" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
        { value: "9", label: "9" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" },
        { value: "14", label: "14" },
        { value: "15", label: "15" },
        { value: "16", label: "16" },
        { value: "17", label: "17" },
        { value: "18", label: "18" },
        { value: "19", label: "19" },
        { value: "20", label: "20" },
        { value: "21", label: "21" },
        { value: "22", label: "22" },
        { value: "23", label: "23" },
        { value: "24", label: "24" },
        { value: "25", label: "25" },
        { value: "26", label: "26" },
        { value: "27", label: "27" },
        { value: "28", label: "28" },
        { value: "29", label: "29" },
        { value: "30", label: "30" },
        { value: "31", label: "31" },
        { value: "32", label: "32" },
      ],
    },
    {
      name: "seatLetterDeparture",
      label: "Letra de asiento de ida:",
      type: "select",
      isRequired: true,
      option: [
        { value: "", label: "--Selecciona--" },
        { value: "A", label: "A" },
        { value: "B", label: "B" },
        { value: "C", label: "C" },
        { value: "D", label: "D" },
        { value: "E", label: "E" },
        { value: "K", label: "K" },
      ],
    },
    {
      name: "seatNumberReturn",
      label: "Número de asiento de vuelta:",
      type: "select",
      isRequired: true,
      option: [
        { value: "", label: "--Selecciona--" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
        { value: "9", label: "9" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" },
        { value: "14", label: "14" },
        { value: "15", label: "15" },
        { value: "16", label: "16" },
        { value: "17", label: "17" },
        { value: "18", label: "18" },
        { value: "19", label: "19" },
        { value: "20", label: "20" },
        { value: "21", label: "21" },
        { value: "22", label: "22" },
        { value: "23", label: "23" },
        { value: "24", label: "24" },
        { value: "25", label: "25" },
        { value: "26", label: "26" },
        { value: "27", label: "27" },
        { value: "28", label: "28" },
        { value: "29", label: "29" },
        { value: "30", label: "30" },
        { value: "31", label: "31" },
        { value: "32", label: "32" },
      ],
      showIf: {
        field: "homeisActiveOptionOutbound",
        equals: "false",
      },
    },
    {
      name: "seatLetterReturn",
      label: "Letra de asiento de vuelta:",
      type: "select",
      isRequired: true,
      option: [
        { value: "", label: "--Selecciona--" },
        { value: "A", label: "A" },
        { value: "B", label: "B" },
        { value: "C", label: "C" },
        { value: "D", label: "D" },
        { value: "E", label: "E" },
        { value: "K", label: "K" },
      ],
      showIf: {
        field: "homeisActiveOptionOutbound",
        equals: "false",
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
          {formData.passengerSelectManually === "false" ||
          formData.passengerSelectManually === "" ? (
            <Text fontSize="md" color="gray.600" textAlign="center" p={4}>
              Los datos de los pasajeros se generarán automáticamente.
            </Text>
          ) : (
            <Accordion allowToggle>
              {generatePassengerList(formData).map((passenger) => (
                <AccordionItem
                  key={passenger.id}
                  border="1px solid #ddd"
                  borderRadius="md"
                  mb={4}
                >
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left" fontWeight="bold">
                        {passenger.title}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>

                  <AccordionPanel>
                    <Grid
                      templateColumns="repeat(2, 1fr)"
                      alignItems={"flex-end"}
                      gap={6}
                    >
                      {passengerInputs.map((field: any) => {
                        if (field.showIf) {
                          const fieldToCheck = `${passenger.id}_${field.showIf.field}`;

                          const expectedValue = field.showIf.noEquals;

                          if (
                            formData[fieldToCheck] === expectedValue ||
                            formData[fieldToCheck] === undefined ||
                            formData[fieldToCheck] === ""
                          ) {
                            return null;
                          }
                        }

                        return (
                          <GridItem key={`${passenger.id}-${field.name}`}>
                            <FormControl isRequired={field.isRequired}>
                              <FormLabel fontSize="sm">{field.label}</FormLabel>
                              {field.type === "select" && (
                                <Select
                                  value={
                                    formData[`${passenger.id}_${field.name}`] ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      [`${passenger.id}_${field.name}`]:
                                        e.target.value,
                                    })
                                  }
                                >
                                  {field.option.map((option: Option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </Select>
                              )}
                              {field.type !== "select" && (
                                <Input
                                  type={field.type}
                                  value={
                                    formData[`${passenger.id}_${field.name}`] ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      [`${passenger.id}_${field.name}`]:
                                        e.target.value,
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
          )}
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
                        const passengers = generatePassengerListToSelect();

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
                            {passengers.map((passenger) => (
                              <option key={passenger?.id} value={passenger?.id}>
                                {passenger?.fullName}
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

      {currentStepConfig.key === 5 &&
        formData.seatSelectManually !== undefined && (
          <Box mb={6}>
            {formData.seatSelectManually === "false" ||
            formData.seatSelectManually === "" ? (
              <Text fontSize="md" color="gray.600" textAlign="center" p={4}>
                Los asientos se seleccionarán automáticamente.
              </Text>
            ) : (
              <Accordion allowToggle>
                {generatePassengerList(formData).map((passenger) => (
                  <AccordionItem
                    key={passenger.id}
                    border="1px solid #ddd"
                    borderRadius="md"
                    mb={4}
                    mt={4}
                  >
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left" fontWeight="bold">
                          {passenger.title}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>

                    <AccordionPanel>
                      <Grid
                        templateColumns="repeat(2, 1fr)"
                        alignItems={"flex-end"}
                        gap={6}
                      >
                        {seatInputs.map((field: any) => {
                          if (field.showIf) {
                            const fieldToCheck = `${field.showIf.field}`;

                            const expectedValue = field.showIf.equals;

                            if (
                              formData[fieldToCheck] !== expectedValue ||
                              formData[fieldToCheck] === undefined ||
                              formData[fieldToCheck] === ""
                            ) {
                              return null;
                            }
                          }

                          return (
                            <GridItem key={`${passenger.id}-${field.name}`}>
                              <FormControl isRequired={field.isRequired}>
                                <FormLabel fontSize="sm">
                                  {field.label}
                                </FormLabel>

                                <Select
                                  value={
                                    formData[`${passenger.id}_${field.name}`] ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      [`${passenger.id}_${field.name}`]:
                                        e.target.value,
                                    })
                                  }
                                >
                                  {field.option.map((option: Option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </Select>
                              </FormControl>
                            </GridItem>
                          );
                        })}
                      </Grid>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </Box>
        )}
    </Box>
  );
};

export default CreateTestFormInputContainer;

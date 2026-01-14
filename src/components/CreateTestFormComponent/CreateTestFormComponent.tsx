import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

//Data
import stepFields from "../../json/CreateTestForm/inputData.json";

//Store
import useTestStore from "../../store/useTestStore/useTestStore";
import useEditTestStore from "../../store/useEditTestStore/useEditTestStore";

//Components
import CreateTestFormNavigationButtonComponent from "../CreateTestFormNavigationButtonComponent/CreateTestFormNavigationButtonComponent";
import CreateTestFormStepHeaderComponent from "../CreateTestFormStepHeaderComponent/CreateTestFormStepHeaderComponent";
import CreateTestFormInputContainer from "../CreateTestFormInputContainer/CreateTestFormInputContainer";

//Types
import type { InputTypes, Option } from "./CreateTestFormComponent.types";

//Utils
import { formDataNormalizer } from "../../utils/formDataNormalizer";
import { groupServices } from "../../utils/groupServices";
import { useFormStep } from "../../hooks/useFormStep";

const CreateTestFormComponent: React.FC = () => {
  const { addTest, isBlocked, updateTest } = useTestStore();
  const { editTest, testIndexToEdit, cleanEditTest } = useEditTestStore();

  const { currentStep, setCurrentStep, nextStep, prevStep, stepRefs } =
    useFormStep();

  const [steps, setSteps] = useState<number[]>([0]);
  const [dependentFieldOption, setDependentFieldOption] = useState<
    Record<string, Option[]>
  >({});

  const initializeFormData = () => {
    const initialData: Record<string, string | number> = {};
    const initialStep = stepFields.find((step) => step.key === 0);

    if (!initialStep) return initialData;

    initialStep.input.forEach((field) => {
      if ((field as InputTypes).hasDefaultValue && !("showIf" in field)) {
        initialData[field.name] = (field as InputTypes).defaultValue ?? "";
      }
    });

    return initialData;
  };

  const [formData, setFormData] = useState(initializeFormData);

  useEffect(() => {
    if (editTest) {
      const updatedData = formDataNormalizer({
        data: editTest,
        stepFields,
        type: "edit",
      });

      setFormData(updatedData);

      if (editTest.targetPage) {
        applyTargetPageFunction(editTest.targetPage);
      }
    }
  }, [editTest]);

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

  useEffect(() => {
    const stepConfig = stepFields.find(
      (step) => step.key === steps[currentStep]
    );

    if (!stepConfig) return;

    const newDefaults: Record<string, any> = {};

    stepConfig.input.forEach((field) => {
      const isVisible = shouldShowField(field);

      if (isVisible && (field as any).hasDefaultValue) {
        const name = field.name;
        const defaultValue = (field as any).defaultValue ?? "";

        if (formData[name] === undefined || formData[name] === "") {
          newDefaults[name] = defaultValue;
        }
      }
    });

    if (Object.keys(newDefaults).length > 0) {
      setFormData((prev) => ({ ...prev, ...newDefaults }));
    }
  }, [currentStep, steps, formData]);

  const handleCreateTestsByLanguages = (data: Record<string, any>) => {
    const selectedLanguages = Array.isArray(data.homeIdioma)
      ? data.homeIdioma
      : typeof data.homeIdioma === "string"
      ? data.homeIdioma.split(",").filter(Boolean)
      : [];

    selectedLanguages.forEach((language) => {
      const testByLanguage = {
        ...data,
        homeIdioma: language,
        id: `${data.id}-${language}`,
      };

      addTest(testByLanguage);
    });
  };

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
    const step = stepFields.find((step) => step.key === targetKey);
    return step?.method || [];
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

  const handleSave = () => {
    let transformedData = {};

    const normalizeData = formDataNormalizer({
      data: formData,
      stepFields,
      type: "new",
    });

    transformedData = groupServices(normalizeData);

    if (editTest && testIndexToEdit !== null) {
      updateTest(testIndexToEdit, transformedData);
      cleanEditTest();
    } else {
      handleCreateTestsByLanguages(transformedData);
    }

    setFormData(initializeFormData);
    setDependentFieldOption({});
    setSteps([0]);
    setCurrentStep(0);
  };

  const currentStepConfig: any = stepFields.find(
    (step) => step.key === steps[currentStep]
  );

  const currentStepFields: any[] =
    (currentStepConfig?.input.filter((field: InputTypes) => {
      const validTypes = [
        "number",
        "text",
        "select",
        "multi-select",
        "searchable-select",
        "date",
      ];
      return validTypes.includes(field.type);
    }) as InputTypes[]) || [];

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

      if (field.name === "homeFechaLLegada") {
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

  const generateDefaultDataByStep = (rawFormData: Record<string, any>) => {
    const formData: Record<string, any> = {
      paymentTypeOfPayment: rawFormData.paymentTypeOfPayment ?? "pse",
      ...rawFormData,
    };

    const defaultData: Record<string, any> = {};
    const targetPage = formData.targetPage;

    const normalize = (value: any) => {
      if (value === true || value === "true" || value === 1 || value === "1")
        return true;
      if (value === false || value === "false" || value === 0 || value === "0")
        return false;
      return value;
    };

    const targetStep = stepFields.find(
      (step) => step.stepTitle.toLowerCase() === targetPage.toLowerCase()
    );

    if (!targetStep) return {};

    const targetKey = targetStep.key;

    stepFields.forEach((step) => {
      if (step.key <= targetKey) {
        step.input.forEach((field) => {
          if ("showIf" in field && field.showIf) {
            const { field: depName, equals } = field.showIf;

            const depVal = formData?.[depName];

            if (normalize(depVal) !== normalize(equals)) {
              return;
            }
          }

          if ((field as any).hasDefaultValue) {
            defaultData[field.name] = (field as any).defaultValue ?? "";
          }
        });
      }
    });

    return defaultData;
  };

  const transformFormDataToTest = (raw: Record<string, any>) => {
    const transformedData = formDataNormalizer({
      data: raw,
      stepFields,
      type: "new",
    });

    return transformedData;
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
      minH="100%"
      bg="white"
    >
      <CreateTestFormStepHeaderComponent
        steps={steps}
        stepFields={stepFields}
        stepRefs={stepRefs}
        currentStep={currentStep}
      />

      <CreateTestFormInputContainer
        currentStepFields={currentStepFields}
        formData={formData}
        setFormData={setFormData}
        editTest={editTest}
        handleInputChange={handleInputChange}
        isBlocked={isBlocked}
        dependentFieldOption={dependentFieldOption}
        currentStepConfig={currentStepConfig}
        shouldShowField={shouldShowField}
      />

      <CreateTestFormNavigationButtonComponent
        currentStep={currentStep}
        prevStep={prevStep}
        nextStep={nextStep}
        editTest={editTest}
        formData={formData}
        steps={steps}
        generateDefaultDataByStep={generateDefaultDataByStep}
        transformFormDataToTest={transformFormDataToTest}
        handleCreateTestsByLanguages={handleCreateTestsByLanguages}
        setFormData={setFormData}
        setDependentFieldOption={setDependentFieldOption}
        setSteps={setSteps}
        setCurrentStep={setCurrentStep}
        initializeFormData={initializeFormData}
        isStepComplete={isStepComplete}
        handleSave={handleSave}
      />
    </Box>
  );
};

export default CreateTestFormComponent;

import { useEffect, useRef, useState } from "react";

export const useFormStep = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const stepRefs = useRef<HTMLElement[]>([]);

  const nextStep = () => setCurrentStep((prev) => prev + 1);

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  useEffect(() => {
    if (stepRefs.current[currentStep]) {
      stepRefs.current[currentStep].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentStep]);

  return { currentStep, setCurrentStep, nextStep, prevStep, stepRefs };
};

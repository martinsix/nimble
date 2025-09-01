"use client";

import { useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";

type BuilderStep = 'class' | 'ancestry-background' | 'attributes' | 'skills' | 'final';

interface StepIndicatorProps {
  currentStep: BuilderStep;
  classSelected: boolean;
  heritageComplete: boolean;
  attributesComplete: boolean;
  skillsComplete: boolean;
}

export function StepIndicator({ currentStep, classSelected, heritageComplete, attributesComplete, skillsComplete }: StepIndicatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef<HTMLDivElement>(null);

  const steps: Array<{ id: BuilderStep; name: string; completed: boolean }> = [
    { id: 'class', name: 'Class', completed: classSelected },
    { id: 'ancestry-background', name: 'Heritage', completed: heritageComplete },
    { id: 'attributes', name: 'Attributes', completed: attributesComplete },
    { id: 'skills', name: 'Skills', completed: skillsComplete },
    { id: 'final', name: 'Review', completed: false }
  ];

  // Auto-center the active step when currentStep changes
  useEffect(() => {
    if (activeStepRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeStep = activeStepRef.current;
      
      const containerWidth = container.clientWidth;
      const activeStepLeft = activeStep.offsetLeft;
      const activeStepWidth = activeStep.clientWidth;
      
      // Calculate the scroll position to center the active step
      const scrollLeft = activeStepLeft - (containerWidth / 2) + (activeStepWidth / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [currentStep]);

  return (
    <div className="w-full mb-4 sm:mb-6">
      <div ref={containerRef} className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center justify-center min-w-max px-4 sm:px-0 space-x-1 sm:space-x-2">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              ref={step.id === currentStep ? activeStepRef : null}
              className="flex items-center shrink-0"
            >
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                step.id === currentStep 
                  ? 'bg-primary text-primary-foreground'
                  : step.completed
                  ? 'bg-green-500 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {index + 1}
              </div>
              <span className={`ml-1 sm:ml-2 text-xs sm:text-sm whitespace-nowrap ${
                step.id === currentStep ? 'font-medium' : 'text-muted-foreground'
              }`}>
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-2 sm:mx-3 text-muted-foreground shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
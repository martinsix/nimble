"use client";

import { ChevronRight } from "lucide-react";

type BuilderStep = 'class' | 'ancestry-background' | 'attributes' | 'final';

interface StepIndicatorProps {
  currentStep: BuilderStep;
  classSelected: boolean;
  heritageComplete: boolean;
  attributesComplete: boolean;
}

export function StepIndicator({ currentStep, classSelected, heritageComplete, attributesComplete }: StepIndicatorProps) {
  const steps: Array<{ id: BuilderStep; name: string; completed: boolean }> = [
    { id: 'class', name: 'Class', completed: classSelected },
    { id: 'ancestry-background', name: 'Heritage', completed: heritageComplete },
    { id: 'attributes', name: 'Attributes', completed: attributesComplete },
    { id: 'final', name: 'Review', completed: false }
  ];

  return (
    <div className="w-full mb-4 sm:mb-6">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center justify-center min-w-max px-4 sm:px-0 space-x-1 sm:space-x-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-shrink-0">
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
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-2 sm:mx-3 text-muted-foreground flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
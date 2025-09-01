"use client";

import { ChevronRight } from "lucide-react";

type BuilderStep = 'class' | 'ancestry-background' | 'attributes' | 'final';

interface StepIndicatorProps {
  currentStep: BuilderStep;
  classSelected: boolean;
  heritageComplete: boolean;
}

export function StepIndicator({ currentStep, classSelected, heritageComplete }: StepIndicatorProps) {
  const steps: Array<{ id: BuilderStep; name: string; completed: boolean }> = [
    { id: 'class', name: 'Class', completed: classSelected },
    { id: 'ancestry-background', name: 'Heritage', completed: heritageComplete },
    { id: 'attributes', name: 'Attributes', completed: false },
    { id: 'final', name: 'Review', completed: false }
  ];

  return (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step.id === currentStep 
              ? 'bg-primary text-primary-foreground'
              : step.completed
              ? 'bg-green-500 text-white'
              : 'bg-muted text-muted-foreground'
          }`}>
            {index + 1}
          </div>
          <span className={`ml-2 text-sm ${
            step.id === currentStep ? 'font-medium' : 'text-muted-foreground'
          }`}>
            {step.name}
          </span>
          {index < steps.length - 1 && (
            <ChevronRight className="w-4 h-4 mx-3 text-muted-foreground" />
          )}
        </div>
      ))}
    </div>
  );
}
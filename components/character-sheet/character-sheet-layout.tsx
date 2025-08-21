import { ReactNode } from "react";

interface CharacterSheetLayoutProps {
  children: ReactNode;
}

export function CharacterSheetLayout({ children }: CharacterSheetLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {children}
    </div>
  );
}
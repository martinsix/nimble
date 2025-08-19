"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { AppSettings, AppMode } from "@/lib/services/settings-service";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

export function SettingsPanel({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange 
}: SettingsPanelProps) {
  const handleModeChange = (mode: AppMode) => {
    onSettingsChange({ ...settings, mode });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* App Mode Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">App Mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup 
                value={settings.mode} 
                onValueChange={(value) => handleModeChange(value as AppMode)}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="full" id="full-mode" className="mt-1" />
                  <div className="space-y-1">
                    <Label htmlFor="full-mode" className="font-medium">
                      Full Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Complete character sheet with inventory, abilities, actions, and all features.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="basic" id="basic-mode" className="mt-1" />
                  <div className="space-y-1">
                    <Label htmlFor="basic-mode" className="font-medium">
                      Basic Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Simplified sheet with HP tracker, action tracker, and dice rolling only.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Current Character Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Active Character</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Character ID: {settings.activeCharacterId}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Use the Characters menu to switch between characters
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
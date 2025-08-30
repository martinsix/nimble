"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Database, Upload, ChevronDown, ChevronRight, FileText, Wand2, Shield, Zap, Sparkles } from "lucide-react";
import { ContentRepositoryService, ContentUploadResult } from "@/lib/services/content-repository-service";

interface ContentManagementPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContentManagementPanel({ isOpen, onClose }: ContentManagementPanelProps) {
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  const contentRepository = ContentRepositoryService.getInstance();
  const customContentStats = contentRepository.getCustomContentStats();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, contentType: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadMessage("");
    setUploadError("");

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        let result: ContentUploadResult;

        switch (contentType) {
          case 'classes':
            result = contentRepository.uploadClasses(content);
            break;
          case 'subclasses':
            result = contentRepository.uploadSubclasses(content);
            break;
          case 'spellSchools':
            result = contentRepository.uploadSpellSchools(content);
            break;
          case 'abilities':
            result = contentRepository.uploadAbilities(content);
            break;
          case 'spells':
            result = contentRepository.uploadSpells(content);
            break;
          default:
            result = { success: false, message: 'Unknown content type' };
        }

        if (result.success) {
          setUploadMessage(result.message);
          setTimeout(() => setUploadMessage(""), 3000);
        } else {
          setUploadError(result.message);
          setTimeout(() => setUploadError(""), 5000);
        }
      } catch (error) {
        setUploadError("Invalid JSON file");
        setTimeout(() => setUploadError(""), 5000);
      }
    };
    reader.readAsText(file);
    
    // Clear the input so the same file can be uploaded again
    event.target.value = '';
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getCustomClasses = () => contentRepository.getAllClasses().filter(cls => 
    !['fighter', 'wizard', 'cleric', 'rogue'].includes(cls.id)
  );

  const getCustomSubclasses = () => contentRepository.getAllSubclasses();

  const getAllSpellSchools = () => contentRepository.getAllSpellSchools();

  const getCustomAbilities = () => contentRepository.getAllActionAbilities();
  
  const getAllSpells = () => {
    // Get all spells from all schools plus loose custom spells
    const allSchools = contentRepository.getAllSpellSchools();
    const schoolSpells = allSchools.flatMap(school => 
      contentRepository.getSpellsBySchool(school.id)
    );
    
    // Remove duplicates by ID
    const uniqueSpells = schoolSpells.filter((spell, index, arr) => 
      arr.findIndex(s => s.id === spell.id) === index
    );
    
    return uniqueSpells;
  };

  const renderContentSection = (
    title: string, 
    icon: React.ReactNode, 
    items: any[], 
    uploadType: string,
    color: string
  ) => {
    const isExpanded = expandedSections[uploadType];
    
    return (
      <Card>
        <Collapsible open={isExpanded} onOpenChange={() => toggleSection(uploadType)}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {icon}
                  {title}
                  <Badge variant="secondary" className={`${color} text-white`}>
                    {items.length}
                  </Badge>
                </div>
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {/* Upload Section */}
              <div className="border rounded-lg p-4 bg-muted/30">
                <Label className="text-sm font-medium mb-2 block">Upload {title}</Label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => handleFileUpload(e, uploadType)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose JSON File
                  </Button>
                </div>
              </div>

              {/* Content List */}
              {items.length > 0 ? (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Current {title}</Label>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {uploadType === 'spells' ? (
                      // Group spells by school
                      Object.entries(
                        items.reduce((groups: Record<string, any[]>, spell) => {
                          const school = spell.school || 'Unknown';
                          if (!groups[school]) groups[school] = [];
                          groups[school].push(spell);
                          return groups;
                        }, {})
                      ).map(([school, spells]) => (
                        <div key={school} className="border rounded p-2">
                          <div className="font-medium text-sm text-purple-600 mb-1">
                            {school} ({spells.length} spells)
                          </div>
                          <div className="space-y-1 ml-2">
                            {spells.map((spell) => (
                              <div key={spell.id} className="flex items-center justify-between text-xs">
                                <div>
                                  <span className="font-medium">{spell.name}</span>
                                  {spell.tier && <span className="text-muted-foreground ml-1">(Tier {spell.tier})</span>}
                                </div>
                                <div className="text-muted-foreground">{spell.id}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      // Regular item display for non-spells
                      items.map((item, index) => (
                        <div key={item.id || index} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <div className="font-medium text-sm">{item.name}</div>
                            {item.description && (
                              <div className="text-xs text-muted-foreground truncate max-w-md">
                                {item.description}
                              </div>
                            )}
                            {item.spells && (
                              <div className="text-xs text-muted-foreground">
                                {item.spells.length} spells
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.id}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No custom {title.toLowerCase()} uploaded yet
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Manage Content
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Status Messages */}
          {uploadMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
              {uploadMessage}
            </div>
          )}
          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
              {uploadError}
            </div>
          )}

          {/* Content Sections */}
          <div className="space-y-4">
            {renderContentSection(
              "Classes", 
              <Shield className="h-4 w-4" />, 
              getCustomClasses(),
              "classes",
              "bg-blue-600"
            )}

            {renderContentSection(
              "Subclasses", 
              <Zap className="h-4 w-4" />, 
              getCustomSubclasses(),
              "subclasses", 
              "bg-green-600"
            )}

            {renderContentSection(
              "Spell Schools", 
              <Sparkles className="h-4 w-4" />, 
              getAllSpellSchools(),
              "spellSchools",
              "bg-purple-600"
            )}

            {renderContentSection(
              "Abilities", 
              <FileText className="h-4 w-4" />, 
              getCustomAbilities(),
              "abilities",
              "bg-orange-600"
            )}

            {renderContentSection(
              "Spells", 
              <Wand2 className="h-4 w-4" />, 
              getAllSpells(),
              "spells",
              "bg-red-600"
            )}
          </div>

          {/* Help Section */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>Upload Instructions:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Select JSON files containing properly formatted content definitions</li>
                  <li>Content will be validated before storage</li>
                  <li>Duplicate IDs will overwrite existing content</li>
                  <li>Custom content is stored locally in your browser</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
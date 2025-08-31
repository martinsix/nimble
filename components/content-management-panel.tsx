"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Database, Upload, ChevronDown, ChevronRight, FileText, Wand2, Shield, Zap, Sparkles, BookOpen } from "lucide-react";
import { ContentRepositoryService, ContentUploadResult } from "@/lib/services/content-repository-service";
import { getSchemaDocumentation, getAllSchemaDocumentation } from "@/lib/utils/schema-documentation";
import { 
  CustomContentType, 
  getAllContentTypes,
  getContentTypeMetadata
} from "@/lib/types/custom-content";
import { SpellAbility, ActionAbility } from "@/lib/types/abilities";
import { ClassDefinition, SubclassDefinition } from "@/lib/types/class";
import { SpellSchoolDefinitionSchema } from "@/lib/schemas/class";
import { z } from 'zod';

type SpellSchoolDefinition = z.infer<typeof SpellSchoolDefinitionSchema>;
type ContentItem = ClassDefinition | SubclassDefinition | SpellSchoolDefinition | ActionAbility | SpellAbility;

interface ContentManagementPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContentManagementPanel({ isOpen, onClose }: ContentManagementPanelProps) {
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<Partial<Record<CustomContentType, boolean>>>({});
  const [showSchemaHelp, setShowSchemaHelp] = useState<Partial<Record<CustomContentType, boolean>>>({});
  
  const contentRepository = ContentRepositoryService.getInstance();
  const customContentStats = contentRepository.getCustomContentStats();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, contentType: CustomContentType) => {
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
          case CustomContentType.CLASS_DEFINITION:
            result = contentRepository.uploadClasses(content);
            break;
          case CustomContentType.SUBCLASS_DEFINITION:
            result = contentRepository.uploadSubclasses(content);
            break;
          case CustomContentType.SPELL_SCHOOL_DEFINITION:
            result = contentRepository.uploadSpellSchools(content);
            break;
          case CustomContentType.ACTION_ABILITY:
            result = contentRepository.uploadAbilities(content);
            break;
          case CustomContentType.SPELL_ABILITY:
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

  const toggleSection = (section: CustomContentType) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleSchemaHelp = (contentType: CustomContentType) => {
    if (contentType) {
      setShowSchemaHelp(prev => ({
        ...prev,
        [contentType]: !prev[contentType]
      }));
    }
  };

  const getContentForType = (contentType: CustomContentType): ContentItem[] => {
    switch (contentType) {
      case CustomContentType.CLASS_DEFINITION:
        return contentRepository.getAllClasses().filter(cls => 
          !['fighter', 'wizard', 'cleric', 'rogue'].includes(cls.id)
        );
      case CustomContentType.SUBCLASS_DEFINITION:
        return contentRepository.getAllSubclasses();
      case CustomContentType.SPELL_SCHOOL_DEFINITION:
        return contentRepository.getAllSpellSchools();
      case CustomContentType.ACTION_ABILITY:
        return contentRepository.getAllActionAbilities();
      case CustomContentType.SPELL_ABILITY:
        return getAllSpells();
      default:
        return [];
    }
  };

  const getIconForType = (iconName: string) => {
    const iconProps = { className: "h-4 w-4" };
    switch (iconName) {
      case 'Shield': return <Shield {...iconProps} />;
      case 'Zap': return <Zap {...iconProps} />;
      case 'Sparkles': return <Sparkles {...iconProps} />;
      case 'FileText': return <FileText {...iconProps} />;
      case 'Wand2': return <Wand2 {...iconProps} />;
      case 'BookOpen': return <BookOpen {...iconProps} />;
      default: return <FileText {...iconProps} />;
    }
  };
  
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
    contentType: CustomContentType,
    count: number,
  ) => {
    const metadata = getContentTypeMetadata(contentType);
    const items = getContentForType(contentType);
    const icon = getIconForType(metadata.icon);
    
    const isExpanded = expandedSections[contentType];
    
    return (
      <Card>
        <Collapsible open={isExpanded} onOpenChange={() => toggleSection(contentType)}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {icon}
                  {metadata.title}
                  <Badge variant="secondary" className={`${metadata.color} text-white`}>
                    {count}
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
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Upload {metadata.title}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSchemaHelp(contentType)}
                    className="h-6 px-2"
                  >
                    <BookOpen className="h-3 w-3 mr-1" />
                    Schema
                  </Button>
                </div>
                
                {(() => {
                  if (contentType && showSchemaHelp[contentType]) {
                    try {
                      const schema = getSchemaDocumentation(contentType);
                      return (
                        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
                          <div className="font-semibold text-blue-900 mb-1">
                            {schema.title || metadata.title} Format
                          </div>
                          {schema.description && (
                            <div className="text-blue-800 mb-2">
                              {schema.description}
                            </div>
                          )}
                          
                          <details className="mt-2">
                            <summary className="font-medium text-blue-900 cursor-pointer">JSON Schema</summary>
                            <pre className="mt-1 p-2 bg-blue-100 rounded overflow-x-auto text-xs">
                              {JSON.stringify(schema, null, 2)}
                            </pre>
                          </details>
                        </div>
                      );
                    } catch {
                      return null;
                    }
                  }
                  return null;
                })()}
                
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => handleFileUpload(e, contentType)}
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
                  <Label className="text-sm font-medium">Current {metadata.title}</Label>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {contentType === CustomContentType.SPELL_ABILITY ? (
                      // Group spells by school
                      Object.entries(
                        (items as SpellAbility[]).reduce((groups: Record<string, SpellAbility[]>, spell) => {
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
                            {'spells' in item && item.spells && (
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
                  No custom {metadata.title.toLowerCase()} uploaded yet
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
            {getAllContentTypes().map(contentType => {
              const count = customContentStats[contentType] || 0;
              return (
                <div key={contentType}>
                  {renderContentSection(contentType, count)}
                </div>
              );
            })}

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
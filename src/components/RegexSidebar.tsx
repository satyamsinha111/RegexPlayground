import React, { useState, useEffect } from 'react';
import { Code, Trash2 } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSavedRegexPatterns, deleteSavedRegexPattern, SavedRegex } from "@/utils/savedRegexUtils";
import { toast } from "@/hooks/use-toast";

const popularRegexes = [
  {
    name: "Email Address",
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    description: "Validates email addresses",
    example: "test@example.com"
  },
  {
    name: "Phone Number (US)",
    pattern: "^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$",
    description: "Matches US phone numbers",
    example: "(555) 123-4567"
  },
  {
    name: "URL",
    pattern: "^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$",
    description: "Validates HTTP/HTTPS URLs",
    example: "https://www.example.com"
  },
  {
    name: "Credit Card",
    pattern: "^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$",
    description: "Matches major credit card formats",
    example: "4532015112830366"
  },
  {
    name: "Password (Strong)",
    pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
    description: "Strong password validation",
    example: "MyPass123!"
  },
  {
    name: "IPv4 Address",
    pattern: "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
    description: "Validates IPv4 addresses",
    example: "192.168.1.1"
  },
  {
    name: "Date (YYYY-MM-DD)",
    pattern: "^\\d{4}-\\d{2}-\\d{2}$",
    description: "ISO date format",
    example: "2023-12-25"
  },
  {
    name: "HTML Tag",
    pattern: "<\\/?[a-z][a-z0-9]*[^<>]*>",
    description: "Matches HTML tags",
    example: "<div class='example'>"
  }
];

interface RegexSidebarProps {
  onSelectRegex?: (regex: typeof popularRegexes[0]) => void;
  selectedRegex?: {
    name: string;
    pattern: string;
    description: string;
    example: string;
  } | null;
  onSavedPatternsChange?: () => void;
}

export const RegexSidebar = ({ onSelectRegex, selectedRegex, onSavedPatternsChange }: RegexSidebarProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [savedPatterns, setSavedPatterns] = useState<SavedRegex[]>([]);

  useEffect(() => {
    loadSavedPatterns();
  }, []);

  const loadSavedPatterns = () => {
    const patterns = getSavedRegexPatterns();
    setSavedPatterns(patterns);
  };

  const handleDeletePattern = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      deleteSavedRegexPattern(id);
      loadSavedPatterns();
      onSavedPatternsChange?.();
      toast({
        title: "Pattern Deleted",
        description: "Saved regex pattern has been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete pattern",
        variant: "destructive",
      });
    }
  };

  const isSelected = (regex: typeof popularRegexes[0] | SavedRegex) => {
    return selectedRegex?.pattern === regex.pattern;
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-white border-r border-slate-200">
        {/* Popular Patterns Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-700 font-semibold">
            {!isCollapsed && "Popular Regex Patterns"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {popularRegexes.map((regex, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <Card 
                      className={`p-3 cursor-pointer transition-colors border-slate-200 ${
                        isSelected(regex)
                          ? 'bg-blue-50 border-blue-300 shadow-sm'
                          : 'hover:bg-slate-50 hover:border-blue-300'
                      }`}
                      onClick={() => onSelectRegex?.(regex)}
                    >
                      <div className="flex items-start gap-2">
                        <Code className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                          isSelected(regex) ? 'text-blue-700' : 'text-blue-600'
                        }`} />
                        {!isCollapsed && (
                          <div className="min-w-0 flex-1">
                            <h3 className={`font-medium text-sm truncate ${
                              isSelected(regex) ? 'text-blue-900' : 'text-slate-900'
                            }`}>
                              {regex.name}
                            </h3>
                            <p className={`text-xs mt-1 line-clamp-2 ${
                              isSelected(regex) ? 'text-blue-700' : 'text-slate-600'
                            }`}>
                              {regex.description}
                            </p>
                            <code className={`text-xs px-1 py-0.5 rounded mt-1 inline-block ${
                              isSelected(regex) 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {regex.example}
                            </code>
                          </div>
                        )}
                      </div>
                    </Card>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Saved Patterns Section */}
        {savedPatterns.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-700 font-semibold">
              {!isCollapsed && "Saved Patterns"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {savedPatterns.map((regex) => (
                  <SidebarMenuItem key={regex.id}>
                    <SidebarMenuButton asChild>
                      <Card 
                        className={`p-3 cursor-pointer transition-colors border-slate-200 relative ${
                          isSelected(regex)
                            ? 'bg-green-50 border-green-300 shadow-sm'
                            : 'hover:bg-slate-50 hover:border-green-300'
                        }`}
                        onClick={() => onSelectRegex?.(regex)}
                      >
                        <div className="flex items-start gap-2">
                          <Code className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                            isSelected(regex) ? 'text-green-700' : 'text-green-600'
                          }`} />
                          {!isCollapsed && (
                            <div className="min-w-0 flex-1 pr-6">
                              <h3 className={`font-medium text-sm truncate ${
                                isSelected(regex) ? 'text-green-900' : 'text-slate-900'
                              }`}>
                                {regex.name}
                              </h3>
                              <p className={`text-xs mt-1 line-clamp-2 ${
                                isSelected(regex) ? 'text-green-700' : 'text-slate-600'
                              }`}>
                                {regex.description}
                              </p>
                              <code className={`text-xs px-1 py-0.5 rounded mt-1 inline-block ${
                                isSelected(regex) 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {regex.example}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-red-100"
                                onClick={(e) => handleDeletePattern(regex.id, e)}
                              >
                                <Trash2 className="h-3 w-3 text-red-600" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </Card>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

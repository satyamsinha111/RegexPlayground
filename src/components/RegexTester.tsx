import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Code, X, Save } from "lucide-react";
import { CodeGenerator } from "./CodeGenerator";
import { saveRegexPattern } from "@/utils/savedRegexUtils";
import { toast } from "@/hooks/use-toast";

interface RegexTesterProps {
  selectedRegex?: {
    name: string;
    pattern: string;
    description: string;
    example: string;
  } | null;
  onSavedPatternsChange?: () => void;
}

export const RegexTester = ({ selectedRegex, onSavedPatternsChange }: RegexTesterProps) => {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');
  
  // Save dialog state
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDescription, setSaveDescription] = useState('');

  // Update pattern and test string when a regex is selected from sidebar
  useEffect(() => {
    if (selectedRegex) {
      setPattern(selectedRegex.pattern);
      setTestString(selectedRegex.example);
      toast({
        title: "Regex Loaded!",
        description: `${selectedRegex.name} pattern has been loaded`,
      });
    }
  }, [selectedRegex]);

  const testRegex = () => {
    if (!pattern) {
      setMatches([]);
      setIsValid(true);
      setError('');
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const allMatches: RegExpMatchArray[] = [];
      
      if (flags.includes('g')) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          allMatches.push(match);
          if (match.index === regex.lastIndex) break;
        }
      } else {
        const match = testString.match(regex);
        if (match) allMatches.push(match);
      }
      
      setMatches(allMatches);
      setIsValid(true);
      setError('');
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Invalid regex pattern');
      setMatches([]);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(testRegex, 300);
    return () => clearTimeout(timeoutId);
  }, [pattern, flags, testString]);

  const handleSavePattern = () => {
    if (!pattern || !saveName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a pattern and name",
        variant: "destructive",
      });
      return;
    }

    try {
      saveRegexPattern({
        name: saveName.trim(),
        pattern: pattern,
        description: saveDescription.trim() || `Custom regex pattern: ${saveName}`,
        example: testString || 'test string',
      });

      toast({
        title: "Pattern Saved!",
        description: `"${saveName}" has been saved to your patterns`,
      });

      // Reset save dialog
      setShowSaveDialog(false);
      setSaveName('');
      setSaveDescription('');
      
      // Notify parent to refresh saved patterns
      onSavedPatternsChange?.();
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save the pattern",
        variant: "destructive",
      });
    }
  };

  const highlightMatches = (text: string, matches: RegExpMatchArray[]) => {
    if (!matches.length) return text;

    const parts = [];
    let lastIndex = 0;

    matches.forEach((match, i) => {
      if (match.index !== undefined) {
        parts.push(text.slice(lastIndex, match.index));
        parts.push(
          <span key={i} className="bg-yellow-200 border border-yellow-400 rounded px-1">
            {match[0]}
          </span>
        );
        lastIndex = match.index + match[0].length;
      }
    });

    parts.push(text.slice(lastIndex));
    return parts;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  const clearInputs = () => {
    setPattern('');
    setTestString('');
    setFlags('g');
    setMatches([]);
    setError('');
    setIsValid(true);
    toast({
      title: "Cleared!",
      description: "All inputs have been reset",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Regex Input Section */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Code className="h-5 w-5" />
              Regular Expression
              {selectedRegex && (
                <Badge variant="secondary" className="ml-2">
                  {selectedRegex.name}
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              {pattern && isValid && (
                <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Pattern
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Regex Pattern</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="save-name">Pattern Name</Label>
                        <Input
                          id="save-name"
                          value={saveName}
                          onChange={(e) => setSaveName(e.target.value)}
                          placeholder="Enter a name for this pattern"
                        />
                      </div>
                      <div>
                        <Label htmlFor="save-description">Description (Optional)</Label>
                        <Textarea
                          id="save-description"
                          value={saveDescription}
                          onChange={(e) => setSaveDescription(e.target.value)}
                          placeholder="Describe what this pattern does"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Pattern Preview</Label>
                        <code className="block p-2 bg-slate-100 rounded text-sm break-all">
                          {pattern}
                        </code>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSavePattern}>
                          Save Pattern
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearInputs}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Pattern
                </label>
                <div className="relative">
                  <Input
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="Enter your regex pattern..."
                    className={`font-mono pr-10 ${!isValid ? 'border-red-500' : 'border-slate-300'}`}
                  />
                  {pattern && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPattern('')}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {!isValid && (
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                )}
              </div>
              <div className="w-32">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Flags
                </label>
                <Input
                  value={flags}
                  onChange={(e) => setFlags(e.target.value)}
                  placeholder="gim"
                  className="font-mono border-slate-300"
                />
              </div>
            </div>
            
            <div className="flex gap-2 text-xs">
              <Badge variant="outline">g = global</Badge>
              <Badge variant="outline">i = case insensitive</Badge>
              <Badge variant="outline">m = multiline</Badge>
              <Badge variant="outline">s = dotall</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test String Section */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-slate-200">
          <CardTitle className="text-slate-800">Test String</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative">
            <Textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test against your regex..."
              className="min-h-32 font-mono border-slate-300 pr-10"
            />
            {testString && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTestString('')}
                className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-slate-200">
            <CardTitle className="text-slate-800">
              Matches ({matches.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {matches.length > 0 ? (
                matches.map((match, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">
                        Match {i + 1}
                      </span>
                      <Badge variant="secondary">
                        Position: {match.index}
                      </Badge>
                    </div>
                    <code className="text-sm bg-white p-2 rounded border block">
                      {match[0]}
                    </code>
                    {match.length > 1 && (
                      <div className="mt-2 space-y-1">
                        {match.slice(1).map((group, gi) => (
                          <div key={gi} className="text-xs text-slate-600">
                            Group {gi + 1}: <code className="bg-slate-200 px-1 rounded">{group}</code>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-8">
                  {pattern ? 'No matches found' : 'Enter a regex pattern to see matches'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-slate-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200">
            <CardTitle className="text-slate-800">Highlighted Text</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="min-h-32 p-4 bg-slate-50 rounded-lg border border-slate-200 font-mono text-sm whitespace-pre-wrap">
              {testString ? highlightMatches(testString, matches) : (
                <span className="text-slate-500">Your text will appear here with matches highlighted</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Code Generation Section */}
      {pattern && isValid && (
        <CodeGenerator 
          pattern={pattern} 
          flags={flags} 
          onCopy={copyToClipboard}
        />
      )}
    </div>
  );
};

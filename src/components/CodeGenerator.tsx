
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface CodeGeneratorProps {
  pattern: string;
  flags: string;
  onCopy: (code: string) => void;
}

export const CodeGenerator = ({ pattern, flags, onCopy }: CodeGeneratorProps) => {
  const escapePattern = (pattern: string) => {
    return pattern.replace(/\\/g, '\\\\');
  };

  const generateCode = (language: string) => {
    const escapedPattern = escapePattern(pattern);
    
    switch (language) {
      case 'javascript':
        return `// JavaScript
const regex = /${pattern}/${flags};
const text = "your test string here";

// Test if pattern matches
const isMatch = regex.test(text);

// Get all matches
const matches = text.match(regex);

// Replace matches
const replaced = text.replace(regex, 'replacement');`;

      case 'python':
        return `# Python
import re

pattern = r"${escapedPattern}"
text = "your test string here"
flags = ${flags.includes('i') ? 're.IGNORECASE | ' : ''}${flags.includes('m') ? 're.MULTILINE | ' : ''}${flags.includes('s') ? 're.DOTALL | ' : ''}0

# Test if pattern matches
is_match = re.search(pattern, text, flags) is not None

# Get all matches
matches = re.findall(pattern, text, flags)

# Replace matches
replaced = re.sub(pattern, "replacement", text, flags=flags)`;

      case 'java':
        return `// Java
import java.util.regex.Pattern;
import java.util.regex.Matcher;

String pattern = "${escapedPattern}";
String text = "your test string here";
int flags = ${flags.includes('i') ? 'Pattern.CASE_INSENSITIVE | ' : ''}${flags.includes('m') ? 'Pattern.MULTILINE | ' : ''}${flags.includes('s') ? 'Pattern.DOTALL | ' : ''}0;

Pattern regex = Pattern.compile(pattern, flags);
Matcher matcher = regex.matcher(text);

// Test if pattern matches
boolean isMatch = matcher.find();

// Replace matches
String replaced = matcher.replaceAll("replacement");`;

      case 'csharp':
        return `// C#
using System.Text.RegularExpressions;

string pattern = @"${escapedPattern}";
string text = "your test string here";
RegexOptions options = ${flags.includes('i') ? 'RegexOptions.IgnoreCase | ' : ''}${flags.includes('m') ? 'RegexOptions.Multiline | ' : ''}${flags.includes('s') ? 'RegexOptions.Singleline | ' : ''}RegexOptions.None;

Regex regex = new Regex(pattern, options);

// Test if pattern matches
bool isMatch = regex.IsMatch(text);

// Get all matches
MatchCollection matches = regex.Matches(text);

// Replace matches
string replaced = regex.Replace(text, "replacement");`;

      case 'php':
        return `<?php
// PHP
$pattern = '/${pattern}/${flags}';
$text = 'your test string here';

// Test if pattern matches
$isMatch = preg_match($pattern, $text);

// Get all matches
preg_match_all($pattern, $text, $matches);

// Replace matches
$replaced = preg_replace($pattern, 'replacement', $text);
?>`;

      case 'go':
        return `// Go
package main

import (
    "regexp"
)

func main() {
    pattern := \`${escapedPattern}\`
    text := "your test string here"
    
    regex := regexp.MustCompile(pattern)
    
    // Test if pattern matches
    isMatch := regex.MatchString(text)
    
    // Get all matches
    matches := regex.FindAllString(text, -1)
    
    // Replace matches
    replaced := regex.ReplaceAllString(text, "replacement")
}`;

      default:
        return '';
    }
  };

  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'csharp', name: 'C#' },
    { id: 'php', name: 'PHP' },
    { id: 'go', name: 'Go' }
  ];

  return (
    <Card className="shadow-lg border-slate-200">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
        <CardTitle className="text-slate-800">Code Generator</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="javascript" className="w-full">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
            {languages.map((lang) => (
              <TabsTrigger key={lang.id} value={lang.id} className="text-xs">
                {lang.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {languages.map((lang) => (
            <TabsContent key={lang.id} value={lang.id} className="mt-4">
              <div className="relative">
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{generateCode(lang.id)}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                  onClick={() => onCopy(generateCode(lang.id))}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

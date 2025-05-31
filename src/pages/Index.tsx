
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { RegexSidebar } from "@/components/RegexSidebar";
import { RegexTester } from "@/components/RegexTester";
import { Header } from "@/components/Header";

const Index = () => {
  const [selectedRegex, setSelectedRegex] = useState<{
    name: string;
    pattern: string;
    description: string;
    example: string;
  } | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const handleSavedPatternsChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RegexSidebar 
          key={refreshKey}
          onSelectRegex={setSelectedRegex} 
          selectedRegex={selectedRegex}
          onSavedPatternsChange={handleSavedPatternsChange}
        />
        <SidebarInset className="flex-1">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            <Header />
            <main className="flex-1 p-6">
              <RegexTester 
                selectedRegex={selectedRegex}
                onSavedPatternsChange={handleSavedPatternsChange}
              />
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;

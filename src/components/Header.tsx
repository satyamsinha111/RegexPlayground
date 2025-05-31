
import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Regex } from "lucide-react";

export const Header = () => {
  return (
    <header className="h-16 border-b bg-white/80 backdrop-blur-sm border-slate-200 flex items-center px-6 shadow-sm">
      <SidebarTrigger className="mr-4 hover:bg-slate-100" />
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <Regex className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            RegexMaster
          </h1>
          <p className="text-sm text-slate-600">Advanced Regular Expression Tester</p>
        </div>
      </div>
    </header>
  );
};

"use client";

import React, { useEffect, useState } from "react";
import { Activity, ShieldCheck, Lock, UploadCloud, ServerOff, CheckCircle2 } from "lucide-react";

export function VisualNetworkMonitor() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full bg-surface border border-border rounded-xl p-6 mb-8 overflow-hidden relative shadow-sm">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
        
        {/* Left Stats Section */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Live Network Monitor</h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            AuraFile executes heavy image and PDF processing strictly within your browser using WebAssembly and local JavaScript. 
            No documents are uploaded to external servers for strictly-local operations.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 bg-background rounded-lg p-3 border border-border/50">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Outbound Traffic</p>
                <div className="flex gap-2 items-center">
                  <p className="text-xl font-bold text-foreground">0 Bytes</p>
                  <span className="flex h-2 w-2 relative mt-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-background rounded-lg p-3 border border-border/50">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Execution</p>
                <p className="text-xl font-bold text-foreground">100% Local</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Animation Section */}
        <div className="w-full md:w-auto min-w-[280px] p-4 bg-background rounded-xl border border-border flex flex-col gap-4 shadow-sm">
          <div className="flex justify-between items-center text-sm font-medium text-muted-foreground mb-2">
            <span className="flex items-center gap-2"><Lock className="w-4 h-4"/> Your Browser</span>
            <span className="flex items-center gap-2"><ServerOff className="w-4 h-4"/> External Servers</span>
          </div>
          
          {/* Connection pathway */}
          <div className="relative flex justify-between items-center h-12">
            <div className="absolute left-6 right-6 h-[2px] bg-border overflow-hidden">
               {/* Simulate blocked connection */}
               <div className="absolute left-1/2 w-8 h-full bg-red-500/50 -translate-x-1/2 blur-[2px]" />
            </div>
            
            <div className="z-10 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]">
               <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            
            <div className="z-10 bg-background px-2">
              <div className="px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"/> Blocked
              </div>
            </div>

            <div className="z-10 w-12 h-12 rounded-full bg-muted flex items-center justify-center border-2 border-border opacity-50">
               <UploadCloud className="w-6 h-6 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex bg-green-500/10 text-green-600 dark:text-green-400 p-2 rounded-md text-xs items-center gap-2 font-medium justify-center mt-2">
            <CheckCircle2 className="w-4 h-4" />
            Privacy Integrity Maintained
          </div>
        </div>
      </div>
    </div>
  );
}

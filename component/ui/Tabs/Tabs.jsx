'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const TabsContext = createContext();

export const Tabs = ({ children, defaultValue, onValueChange, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  useEffect(() => {
    if (defaultValue) {
      setActiveTab(defaultValue);
    }
  }, [defaultValue]);

  const handleTabChange = (val) => {
    setActiveTab(val);
    if (onValueChange) onValueChange(val);
  };

  return (
    <TabsContext.Provider value={{ activeTab, handleTabChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className = '' }) => (
  <div className={`inline-flex gap-2 p-2 bg-muted/40 backdrop-blur-xl rounded-3xl border border-border/50 ${className}`}>
    {children}
  </div>
);

export const TabsTrigger = ({ value, children, className = '' }) => {
  const { activeTab, handleTabChange } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button 
      type="button"
      onClick={() => handleTabChange(value)}
      className={`px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 ${
        isActive 
          ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
          : 'text-muted-foreground hover:text-foreground hover:bg-white/10'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, className = '' }) => {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) return null;

  return (
    <div className={`mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ${className}`}>
      {children}
    </div>
  );
};

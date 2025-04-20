import React, { createContext, useContext, useState } from 'react';

// Create context
const TabsContext = createContext({
  value: '',
  onValueChange: () => {},
});

// Tabs Container
export function Tabs({ children, value, onValueChange, className = '' }) {
  const [activeTab, setActiveTab] = useState(value);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    onValueChange(newValue);
  };

  return (
    <TabsContext.Provider value={{ value: activeTab, onValueChange: handleTabChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// Tabs List
export function TabsList({ children, className = '' }) {
  return (
    <div className={`inline-flex items-center rounded-lg p-1 bg-gray-100 ${className}`}>
      {children}
    </div>
  );
}

// Tab Trigger
export function TabsTrigger({ children, value, className = '' }) {
  const { value: activeValue, onValueChange } = useContext(TabsContext);
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onValueChange(value)}
      className={`
        py-2 px-3 
        text-sm font-medium 
        rounded-md
        transition-all
        ${isActive 
          ? 'bg-white text-orange-700 shadow-sm' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// Tab Content
export function TabsContent({ children, value, className = '' }) {
  const { value: activeValue } = useContext(TabsContext);
  const isActive = activeValue === value;

  if (!isActive) return null;

  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
}
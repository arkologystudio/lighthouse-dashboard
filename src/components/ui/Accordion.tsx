import React, { createContext, useContext, useState } from 'react';

interface AccordionContextType {
  expandedItems: string[];
  toggleItem: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

interface AccordionProps {
  children: React.ReactNode;
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ 
  children, 
  type = 'single',
  defaultValue = [],
  className = ''
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue : [defaultValue].filter(Boolean)
  );

  const toggleItem = (value: string) => {
    if (type === 'single') {
      setExpandedItems(prev => prev.includes(value) ? [] : [value]);
    } else {
      setExpandedItems(prev => 
        prev.includes(value) 
          ? prev.filter(item => item !== value)
          : [...prev, value]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ expandedItems, toggleItem }}>
      <div className={`space-y-2 ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ 
  children,
  className = ''
}) => (
  <div className={`border rounded-lg ${className}`}>
    {children}
  </div>
);

interface AccordionTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ 
  children, 
  value,
  className = ''
}) => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionTrigger must be used within Accordion');
  
  const { expandedItems, toggleItem } = context;
  const isExpanded = expandedItems.includes(value);

  return (
    <button
      className={`
        flex w-full items-center justify-between px-4 py-3 text-sm font-medium
        transition-all hover:bg-gray-50 dark:hover:bg-gray-800
        ${className}
      `}
      onClick={() => toggleItem(value)}
      aria-expanded={isExpanded}
    >
      {children}
      <svg
        className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

interface AccordionContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({ 
  children, 
  value,
  className = ''
}) => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionContent must be used within Accordion');
  
  const { expandedItems } = context;
  const isExpanded = expandedItems.includes(value);

  if (!isExpanded) return null;

  return (
    <div className={`px-4 pb-3 pt-0 text-sm ${className}`}>
      {children}
    </div>
  );
};
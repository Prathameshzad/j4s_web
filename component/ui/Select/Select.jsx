import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import '../ui.css';

const SelectContext = createContext();

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {any} [props.value]
 * @param {(value: any) => void} [props.onValueChange]
 * @param {string} [props.className]
 */
export const Select = ({ children, value, onValueChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen, selectedLabel, setSelectedLabel }}>
      <div ref={containerRef} className={`relative w-full ${className}`}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 */
export const SelectTrigger = ({ children, className = '' }) => {
  const { setIsOpen, isOpen } = useContext(SelectContext);
  return (
    <div 
      onClick={() => setIsOpen(!isOpen)}
      className={`flex h-14 w-full items-center justify-between rounded-2xl border border-border/60 bg-background px-6 py-2 text-sm font-bold text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 focus:shadow-xl transition-all duration-300 cursor-pointer group ${className}`}
    >
      {children}
      <ChevronDown className={`h-4 w-4 opacity-40 transition-transform duration-300 group-hover:text-primary ${isOpen ? 'rotate-180 opacity-100 text-primary' : ''}`} />
    </div>
  );
};

/**
 * @param {Object} props
 * @param {string} [props.placeholder]
 */
export const SelectValue = ({ placeholder }) => {
  const { selectedLabel, value } = useContext(SelectContext);
  return (
    <span className="truncate font-black uppercase tracking-widest text-[10px]">
      {value ? selectedLabel : <span className="opacity-40">{placeholder}</span>}
    </span>
  );
};

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 */
export const SelectContent = ({ children, className = '' }) => {
  const { isOpen } = useContext(SelectContext);

  return (
    <div className={`absolute z-50 mt-3 max-h-72 w-full overflow-auto rounded-[32px] border border-border/50 bg-card/90 backdrop-blur-2xl p-2 text-foreground shadow-2xl transition-all duration-300 ${isOpen ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible -translate-y-4 scale-95 pointer-events-none'} ${className}`}>
      {children}
    </div>
  );
};

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {any} [props.value]
 * @param {string} [props.className]
 */
export const SelectItem = ({ children, value: itemValue, className = '' }) => {
  const { onValueChange, value, setIsOpen, setSelectedLabel } = useContext(SelectContext);
  
  const isSelected = value === itemValue;

  useEffect(() => {
    if (isSelected) {
      setSelectedLabel(children);
    }
  }, [isSelected, children, setSelectedLabel]);

  return (
    <div
      onClick={() => {
        onValueChange(itemValue);
        setIsOpen(false);
      }}
      className={`relative flex w-full cursor-pointer select-none items-center rounded-2xl py-3.5 px-4 text-[10px] font-black uppercase tracking-widest outline-none transition-all duration-200 hover:bg-primary hover:text-white ${isSelected ? 'bg-primary/10 text-primary' : 'text-foreground/70'} ${className}`}
    >
      <span className="flex-1">{children}</span>
      {isSelected && <Check className="h-3 w-3 ml-2" />}
    </div>
  );
};

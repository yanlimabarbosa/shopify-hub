"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export type ComboboxOption = {
  value: string;
  label: string;
};

type ComboboxProps = {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  emptyMessage?: string;
};

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Selecione uma opção...",
  className,
  emptyMessage = "Nenhuma opção encontrada",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [filteredOptions, setFilteredOptions] = React.useState(options);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Find selected option
  const selectedOption = options.find((opt) => opt.value === value);

  // Update input value when selection changes externally
  React.useEffect(() => {
    if (selectedOption && !isTyping) {
      setInputValue(selectedOption.label);
    } else if (!value && !isTyping) {
      setInputValue("");
    }
  }, [value, selectedOption, isTyping]);

  // Filter options based on input
  React.useEffect(() => {
    if (inputValue.trim() === "" || (!isTyping && inputValue === selectedOption?.label)) {
      // Show all options when input is empty or matches selected option exactly (not typing)
      setFilteredOptions(options);
    } else {
      // Filter when user is typing
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [inputValue, options, isTyping, selectedOption]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsTyping(true);
    setOpen(true);
    
    // If input is cleared, clear selection
    if (newValue === "") {
      onValueChange?.("");
    }
  };

  // Handle option selection
  const handleSelect = (option: ComboboxOption) => {
    setInputValue(option.label);
    setIsTyping(false);
    onValueChange?.(option.value);
    setOpen(false);
    inputRef.current?.blur();
  };

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        // Reset input to selected value if user clicks outside
        if (selectedOption) {
          setInputValue(selectedOption.label);
        } else {
          setInputValue("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedOption]);

  // Handle input focus
  const handleFocus = () => {
    setOpen(true);
    // When focusing, if input matches selected option, show all options
    if (inputValue === selectedOption?.label) {
      setIsTyping(false);
    }
  };
  
  // Handle input blur (but not when clicking an option)
  const handleBlur = () => {
    // Small delay to allow option click to register
    setTimeout(() => {
      setIsTyping(false);
    }, 200);
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full pr-8 border-0 bg-input/30 focus-visible:ring-0 focus-visible:border-0"
        />
        <button
          type="button"
          onClick={() => {
            setOpen(!open);
            setIsTyping(false);
            inputRef.current?.focus();
          }}
          className="absolute right-0 top-0 h-full px-2 flex items-center justify-center"
        >
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </button>
      </div>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <ul className="p-1">
              {filteredOptions.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelect(option);
                      }
                    }}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus:bg-accent focus:text-accent-foreground",
                      value === option.value && "bg-accent text-accent-foreground"
                    )}
                  >
                    <span className="flex-1 text-left">{option.label}</span>
                    {value === option.value && (
                      <Check className="h-4 w-4 ml-2" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

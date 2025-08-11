import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, Check, X } from 'lucide-react';

const Select = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  fullWidth = false,
  size = 'md',
  clearable = false,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || null;

  const baseInputClasses = 'flex items-center justify-between rounded-md border bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors';
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  return (
    <div ref={containerRef} className={`${fullWidth ? 'w-full' : ''} relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`${baseInputClasses} ${sizes[size]} w-full border-gray-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`truncate ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="flex items-center gap-1">
          {clearable && selectedOption && !disabled && (
            <X
              className="h-4 w-4 text-gray-400 hover:text-gray-500"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
            />
          )}
          <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          className="absolute z-50 mt-2 w-full max-h-64 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg animate-in fade-in zoom-in-95 duration-100"
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">No options</div>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-50 ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="h-4 w-4" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  clearable: PropTypes.bool,
  className: PropTypes.string,
};

export default Select;



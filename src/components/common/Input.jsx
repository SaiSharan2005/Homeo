import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  type = 'text',
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = false,
  className = '',
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [inputType, setInputType] = React.useState(type);

  React.useEffect(() => {
    if (type === 'password' && showPasswordToggle) {
      setInputType(showPassword ? 'text' : 'password');
    } else {
      setInputType(type);
    }
  }, [type, showPassword, showPasswordToggle]);

  const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  
  const classes = [
    baseClasses,
    stateClasses,
    fullWidth ? 'w-full' : '',
    leftIcon ? 'pl-10' : '',
    (rightIcon || (type === 'password' && showPasswordToggle)) ? 'pr-10' : '',
    className
  ].filter(Boolean).join(' ');

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={classes}
          disabled={disabled}
          required={required}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
        
        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={togglePassword}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.propTypes = {
  type: PropTypes.oneOf([
    'text',
    'email',
    'password',
    'number',
    'tel',
    'url',
    'date',
    'datetime-local',
    'time',
    'search',
    'file'
  ]),
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  showPasswordToggle: PropTypes.bool,
};

Input.displayName = 'Input';

export default Input; 
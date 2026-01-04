'use client';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { SelectHTMLAttributes, ReactNode, CSSProperties, useState } from 'react';

const dropdownClasses = cva(
  'inline-flex items-center justify-between cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-background',
  {
    variants: {
      variant: {
        default: 'bg-search-background border-0',
        outlined: 'bg-transparent border border-border-secondary',
      },
      size: {
        small: 'text-sm px-3 py-2',
        medium: 'text-base px-4 py-3',
        large: 'text-lg px-6 py-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'medium',
    },
  }
)

interface DropdownProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>, VariantProps<typeof dropdownClasses> {
  // Required parameters with defaults
  placeholder?: string;
  text_font_size?: string;
  text_font_family?: string;
  text_font_weight?: string;
  text_line_height?: string;
  text_text_align?: string;
  text_color?: string;
  fill_background_color?: string;
  border_border_radius?: string;
  
  // Optional parameters
  layout_gap?: string;
  layout_width?: string;
  padding?: string;
  margin?: string;
  position?: string;
  
  // Additional props
  options?: Array<{ value: string; label: string }>;
  icon?: ReactNode;
}

const Dropdown = ({
  // Required parameters with defaults
  placeholder = "Latest",
  text_font_size = "text-base",
  text_font_family = "Satoshi",
  text_font_weight = "font-medium",
  text_line_height = "leading-normal",
  text_text_align = "left",
  text_color = "text-text-primary",
  fill_background_color = "bg-search-background",
  border_border_radius = "rounded-lg",
  
  // Optional parameters (no defaults)
  layout_gap,
  layout_width,
  padding,
  margin,
  position,
  
  // Standard React props
  variant,
  size,
  className,
  options = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'popular', label: 'Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ],
  icon,
  value,
  onChange,
  ...props
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value || options[0]?.value || '')

  // Safe validation for optional parameters
  const hasValidGap = layout_gap && typeof layout_gap === 'string' && layout_gap.trim() !== ''
  const hasValidWidth = layout_width && typeof layout_width === 'string' && layout_width.trim() !== ''
  const hasValidPadding = padding && typeof padding === 'string' && padding.trim() !== ''
  const hasValidPosition = position && typeof position === 'string' && position.trim() !== ''
  const hasValidMargin = margin && typeof margin === 'string' && margin.trim() !== ''

  const optionalClasses = [
    hasValidGap ? `gap-[${layout_gap}]` : 'gap-2',
    hasValidWidth ? `w-[${layout_width}]` : 'w-auto min-w-[120px]',
    hasValidPadding ? `p-[${padding}]` : '',
    hasValidPosition ? position : 'relative',
    hasValidMargin ? `m-[${margin}]` : '',
  ].filter(Boolean).join(' ')

  // Build custom styles for non-Tailwind properties
  const customStyles: CSSProperties = {
    ...(text_font_family && !text_font_family.startsWith('font-') && { fontFamily: text_font_family }),
  }

  // Build Tailwind classes for styling
  const styleClasses = [
    text_font_size,
    text_font_family.startsWith('font-') ? text_font_family : '',
    text_font_weight,
    text_line_height,
    `text-${text_text_align}`,
    text_color,
    fill_background_color,
    border_border_radius,
  ].filter(Boolean).join(' ')

  const selectedOption = options.find(option => option.value === selectedValue)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue)
    setIsOpen(false)
    if (onChange) {
      const event = { target: { value: optionValue } } as React.ChangeEvent<HTMLSelectElement>
      onChange(event)
    }
  }

  const handleNativeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setSelectedValue(e.target.value)
  if (onChange) {
    onChange(e)
  }
}

  return (
    <div className={twMerge('relative', optionalClasses)} style={customStyles}>
      <button
        type="button"
        onClick={handleToggle}
        className={twMerge(
          dropdownClasses({ variant, size }),
          styleClasses,
          className
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {selectedOption?.label || placeholder}
        </span>
        {icon || (
          <svg
            className={twMerge(
              'w-4 h-4 transition-transform duration-200',
              isOpen ? 'rotate-180' : 'rotate-0'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
      
      {isOpen && (
        <div className={twMerge(
          'absolute top-full left-0 right-0 mt-1 bg-secondary-background border border-border-secondary shadow-lg z-50',
          border_border_radius
        )}>
          <ul role="listbox" className="py-1">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={twMerge(
                    'w-full text-left px-4 py-2 hover:bg-secondary-light transition-colors duration-150',
                    text_font_size,
                    text_font_weight,
                    selectedValue === option.value ? 'bg-secondary-light font-medium' : 'font-normal'
                  )}
                  role="option"
                  aria-selected={selectedValue === option.value}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Hidden select for form submission */}
      <select
        value={selectedValue}
        onChange={handleNativeChange}
        className="sr-only"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Dropdown
"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { InputHTMLAttributes, ReactNode, CSSProperties, useState } from "react";
import { BorderAllRounded } from "@mui/icons-material";

const searchClasses = cva(
  "inline-flex items-center transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-background",
  {
    variants: {
      variant: {
        default: "bg-search-background border-0",
        outlined: "bg-transparent border border-border-secondary",
      },
      size: {
        small: "text-sm px-3 py-2",
        medium: "text-base px-4 py-3",
        large: "text-lg px-6 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "medium",
    },
  }
);

interface SearchViewProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof searchClasses> {
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
  position?: string;
  margin?: string;

  // Additional props
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const SearchView = ({
  // Required parameters with defaults
  placeholder = "Search for products...",
  text_font_size = "text-base",
  text_font_family = "Satoshi",
  text_font_weight = "font-normal",
  text_line_height = "leading-normal",
  text_text_align = "left",
  text_color = "text-search-text",
  fill_background_color = "bg-search-background",

  // Optional parameters (no defaults)
  layout_gap,
  layout_width,
  padding,
  position,
  margin,

  // Standard React props
  variant,
  size,
  className,
  leftIcon,
  rightIcon,
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}: SearchViewProps) => {
  const [isFocused, setIsFocused] = useState(false);

  // Safe validation for optional parameters
  const hasValidGap =
    layout_gap && typeof layout_gap === "string" && layout_gap.trim() !== "";
  const hasValidWidth =
    layout_width &&
    typeof layout_width === "string" &&
    layout_width.trim() !== "";
  const hasValidPadding =
    padding && typeof padding === "string" && padding.trim() !== "";
  const hasValidPosition =
    position && typeof position === "string" && position.trim() !== "";
  const hasValidMargin =
    margin && typeof margin === "string" && margin.trim() !== "";

  const optionalClasses = [
    hasValidGap ? `gap-[${layout_gap}]` : "gap-3",
    hasValidWidth ? `w-[${layout_width}]` : "w-full",
    hasValidPadding ? `p-[${padding}]` : "",
    hasValidPosition ? position : "",
    hasValidMargin ? `m-[${margin}]` : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Build custom styles for non-Tailwind properties
  const customStyles: CSSProperties = {
    ...(text_font_family &&
      !text_font_family.startsWith("font-") && {
        fontFamily: text_font_family,
      }),
  };

  // Build Tailwind classes for styling
  const styleClasses = [
    text_font_size,
    text_font_family.startsWith("font-") ? text_font_family : "",
    text_font_weight,
    text_line_height,
    `text-${text_text_align}`,
    fill_background_color,
  ]
    .filter(Boolean)
    .join(" ");

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(event);
  };

  return (
    <div
      className={twMerge(
        searchClasses({ variant, size }),
        styleClasses,
        optionalClasses,
        isFocused ? "ring-2 ring-primary-background" : "",
        className
      )}
      style={customStyles}
    >
      {leftIcon && <div className="flex-shrink-0">{leftIcon}</div>}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={twMerge(
          "flex-1 bg-transparent border-0 outline-none placeholder-current",
          text_color,
          text_font_size,
          text_font_weight
        )}
        {...props}
      />
      {rightIcon && <div className="flex-shrink-0">{rightIcon}</div>}
    </div>
  );
};

export default SearchView;

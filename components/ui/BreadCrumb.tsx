'use client';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { HTMLAttributes, ReactNode, CSSProperties } from 'react';
 import Link from'next/link';

const breadcrumbClasses = cva(
  'flex items-center',
  {
    variants: {
      size: {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  }
)

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

interface BreadCrumbProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof breadcrumbClasses> {
  // Optional parameters
  layout_gap?: string;
  layout_justify_content?: string;
  layout_align_items?: string;
  layout_width?: string;
  position?: string;
  
  // Additional props
  items?: BreadcrumbItem[];
  separator?: ReactNode;
  maxItems?: number;
}

const BreadCrumb = ({
  // Optional parameters (no defaults)
  layout_gap,
  layout_justify_content,
  layout_align_items,
  layout_width,
  position,
  
  // Additional props
  items = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Men' },
    { label: 'T-shirts' }
  ],
  separator,
  maxItems,
  
  // Standard React props
  size,
  className,
  ...props
}: BreadCrumbProps) => {
  // Safe validation for optional parameters
  const hasValidGap = layout_gap && typeof layout_gap === 'string' && layout_gap.trim() !== ''
  const hasValidJustifyContent = layout_justify_content && typeof layout_justify_content === 'string' && layout_justify_content.trim() !== ''
  const hasValidAlignItems = layout_align_items && typeof layout_align_items === 'string' && layout_align_items.trim() !== ''
  const hasValidWidth = layout_width && typeof layout_width === 'string' && layout_width.trim() !== ''
  const hasValidPosition = position && typeof position === 'string' && position.trim() !== ''

  const justifyContentMap: Record<string, string> = {
    'start': 'justify-start',
    'center': 'justify-center',
    'end': 'justify-end',
    'spaceBetween': 'justify-between',
    'spaceAround': 'justify-around',
    'spaceEvenly': 'justify-evenly',
  }

  const alignItemsMap: Record<string, string> = {
    'start': 'items-start',
    'center': 'items-center',
    'end': 'items-end',
    'stretch': 'items-stretch',
    'baseline': 'items-baseline',
  }

  const optionalClasses = [
    hasValidGap ? `gap-[${layout_gap}]` : 'gap-2',
    hasValidJustifyContent ? justifyContentMap[layout_justify_content] || 'justify-start' : 'justify-start',
    hasValidAlignItems ? alignItemsMap[layout_align_items] || 'items-center' : 'items-center',
    hasValidWidth ? `w-[${layout_width}]` : '',
    hasValidPosition ? position : '',
  ].filter(Boolean).join(' ')

  // Build custom styles
  const customStyles: CSSProperties = {}

  // Default separator
  const defaultSeparator = (
    <svg
      className="w-4 h-4 text-text-muted mx-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )

  // Limit items if maxItems is specified
  const displayItems = maxItems && items.length > maxItems 
    ? [
        items[0],
        { label: '...', href: undefined },
        ...items.slice(items.length - (maxItems - 2))
      ]
    : items

  return (
    <nav
      className={twMerge(
        breadcrumbClasses({ size }),
        optionalClasses,
        className
      )}
      style={customStyles}
      aria-label="Breadcrumb"
      {...props}
    >
      <ol className="flex items-center">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1
          const isEllipsis = item.label === '...'
          
          return (
            <li key={index} className="flex items-center">
              {item.icon && (
                <span className="mr-2">
                  {item.icon}
                </span>
              )}
              
              {isEllipsis ? (
                <span className="text-text-muted px-2">...</span>
              ) : item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-text-muted hover:text-text-primary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-background rounded-sm"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={twMerge(
                    isLast ? 'text-text-primary font-medium' : 'text-text-muted'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              
              {!isLast && (
                <span role="presentation">
                  {separator || defaultSeparator}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default BreadCrumb
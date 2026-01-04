'use client';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { HTMLAttributes, useState, CSSProperties } from 'react';

const ratingClasses = cva(
  'inline-flex items-center gap-1',
  {
    variants: {
      size: {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg',
      },
      variant: {
        default: 'text-star-background',
        outlined: 'text-border-secondary',
      },
    },
    defaultVariants: {
      size: 'medium',
      variant: 'default',
    },
  }
)

interface RatingBarProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof ratingClasses> {
  // Optional parameters
  layout_width?: string;
  position?: string;
  
  // Additional props
  rating?: number;
  maxRating?: number;
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
  starSize?: number;
}

const RatingBar = ({
  // Optional parameters (no defaults)
  layout_width,
  position,
  
  // Additional props
  rating = 0,
  maxRating = 5,
  readonly = true,
  onRatingChange,
  showValue = false,
  starSize = 20,
  
  // Standard React props
  size,
  variant,
  className,
  ...props
}: RatingBarProps) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [currentRating, setCurrentRating] = useState(rating)

  // Safe validation for optional parameters
  const hasValidWidth = layout_width && typeof layout_width === 'string' && layout_width.trim() !== ''
  const hasValidPosition = position && typeof position === 'string' && position.trim() !== ''

  const optionalClasses = [
    hasValidWidth ? `w-[${layout_width}]` : '',
    hasValidPosition ? position : '',
  ].filter(Boolean).join(' ')

  // Build custom styles
  const customStyles: CSSProperties = {}

  const handleStarClick = (starIndex: number) => {
    if (readonly) return
    
    const newRating = starIndex + 1
    setCurrentRating(newRating)
    if (onRatingChange) {
      onRatingChange(newRating)
    }
  }

  const handleStarHover = (starIndex: number) => {
    if (readonly) return
    setHoverRating(starIndex + 1)
  }

  const handleMouseLeave = () => {
    if (readonly) return
    setHoverRating(null)
  }

  const displayRating = hoverRating !== null ? hoverRating : currentRating

  return (
    <div
      className={twMerge(
        ratingClasses({ size, variant }),
        optionalClasses,
        !readonly ? 'cursor-pointer' : '',
        className
      )}
      style={customStyles}
      onMouseLeave={handleMouseLeave}
      role="img"
      aria-label={`Rating: ${currentRating} out of ${maxRating} stars`}
      {...props}
    >
      {Array.from({ length: maxRating }, (_, index) => {
        const isFilled = index < displayRating
        const isHalfFilled = !Number.isInteger(displayRating) && index === Math.floor(displayRating)
        
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => handleStarHover(index)}
            disabled={readonly}
            className={twMerge(
              'focus:outline-none focus:ring-2 focus:ring-primary-background rounded-sm transition-colors duration-150',
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            )}
            aria-label={`${index + 1} star${index + 1 !== 1 ? 's' : ''}`}
          >
            <svg
              width={starSize}
              height={starSize}
              viewBox="0 0 24 24"
              className={twMerge(
                'transition-colors duration-150',
                isFilled ? 'text-[#FFC633]' : 'text-[#FFFFFF]'
              )}
            >
              {isHalfFilled ? (
                <defs>
                  <linearGradient id={`half-${index}`}>
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              ) : null}
              <path
                fill={isHalfFilled ? `url(#half-${index})` : 'currentColor'}
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
          </button>
        )
      })}
      
      {showValue && (
        <span className="ml-2 text-text-muted">
          ({currentRating.toFixed(1)})
        </span>
      )}
    </div>
  )
}

export default RatingBar
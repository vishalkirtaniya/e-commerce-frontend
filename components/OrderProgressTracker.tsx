"use client";

interface Step {
  label: string;
  date: string;
}

interface Props {
  steps: Step[];
  currentStep: number;
}

export default function OrderProgressTracker({ steps, currentStep }: Props) {
  const progressPercentage =
    steps.length > 1 ? (currentStep / (steps.length - 2)) * 100 : 0;

  return (
    <div className="mt-10">
      <div className="relative h-20">
        {/* Base line (between first & last dot only) */}
        <div className="absolute h-full w-full flex justify-center items-center">
          <div className=" h-[3px] bg-gray-200 w-full" />
        </div>

        {/* Active progress line */}
        <div className="absolute h-full w-full flex items-center">
          <div
            className="absolute h-[4px] bg-black transition-all duration-300"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between relative z-10">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStep;

            return (
              <div
                key={step.label}
                className="flex flex-col justify-center items-center "
              >
                {/* Label */}
                <p
                  className={`text-sm mb-3 font-medium text-center ${
                    isCompleted ? "text-black" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>

                {/* Dot */}
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    isCompleted ? "bg-black" : "bg-gray-300"
                  }`}
                />

                {/* Date */}
                <p className="text-xs text-gray-400 mt-3 text-center">
                  {step.date}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

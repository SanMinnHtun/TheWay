import { useEffect, useMemo, useState } from "react";

interface NumberTickerProps {
  value: number;
  startValue?: number;
  delay?: number;
  decimalPlaces?: number;
  className?: string;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function NumberTicker({ value, startValue = 0, delay = 0, decimalPlaces = 0, className }: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(prefersReducedMotion() ? value : startValue);
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces
      }),
    [decimalPlaces]
  );

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplayValue(value);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      const duration = 720;
      let firstFrame = 0;

      const animate = (timestamp: number) => {
        if (!firstFrame) {
          firstFrame = timestamp;
        }

        const elapsed = Math.min((timestamp - firstFrame) / duration, 1);
        const eased = 1 - Math.pow(1 - elapsed, 3);
        setDisplayValue(startValue + (value - startValue) * eased);

        if (elapsed < 1) {
          window.requestAnimationFrame(animate);
        }
      };

      window.requestAnimationFrame(animate);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, startValue, value]);

  return <span className={className}>{formatter.format(displayValue)}</span>;
}

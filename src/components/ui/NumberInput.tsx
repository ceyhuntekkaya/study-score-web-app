'use client';

import * as React from "react";
import { Input, InputProps } from "./Input";

export type NumberInputType = 'money' | 'percent' | 'number' | 'distance';

export interface NumberInputProps extends Omit<InputProps, 'onChange' | 'value' | 'type'> {
    value?: number;
    onChange?: (value: number) => void;
    inputType?: NumberInputType;
    currency?: string;
    locale?: string;
    allowNegative?: boolean;
    maxValue?: number;
    minValue?: number;
    decimalPlaces?: number;
    unit?: string;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
    ({
         value = 0,
         onChange,
         inputType = 'number',
         currency = "TRY",
         locale = "tr-TR",
         allowNegative = false,
         maxValue,
         minValue = 0,
         decimalPlaces,
         unit = 'km',
         ...props
     }, ref) => {
        const [displayValue, setDisplayValue] = React.useState<string>('');
        const [isFocused, setIsFocused] = React.useState(false);

        const formatValue = (amount: number): string => {
            switch (inputType) {
                case 'money':
                    return new Intl.NumberFormat(locale, {
                        style: 'currency',
                        currency: currency,
                        minimumFractionDigits: decimalPlaces ?? 2,
                        maximumFractionDigits: decimalPlaces ?? 2
                    }).format(amount);

                case 'percent':
                    return new Intl.NumberFormat(locale, {
                        style: 'percent',
                        minimumFractionDigits: decimalPlaces ?? 2,
                        maximumFractionDigits: decimalPlaces ?? 2
                    }).format(amount / 100);

                case 'distance':
                    return new Intl.NumberFormat(locale, {
                        minimumFractionDigits: decimalPlaces ?? 2,
                        maximumFractionDigits: decimalPlaces ?? 2
                    }).format(amount) + ' ' + unit;

                case 'number':
                default:
                    return new Intl.NumberFormat(locale, {
                        minimumFractionDigits: decimalPlaces ?? 2,
                        maximumFractionDigits: decimalPlaces ?? 2
                    }).format(amount);
            }
        };

        const parseValue = (text: string): number => {
            const cleanText = text.replace(/[^\d,.-]/g, '');
            if (!cleanText) return 0;
            const normalizedText = cleanText.replace(',', '.');
            const parsed = parseFloat(normalizedText);
            return isNaN(parsed) ? 0 : parsed;
        };

        const getPlaceholder = (): string => {
            if (props.placeholder) return props.placeholder;
            switch (inputType) {
                case 'money':
                    return formatValue(0);
                case 'percent':
                    return '0%';
                case 'distance':
                    return `0 ${unit}`;
                case 'number':
                default:
                    return '0';
            }
        };

        React.useEffect(() => {
            if (!isFocused) {
                setDisplayValue(formatValue(value));
            }
        }, [value, isFocused, locale, currency, inputType, unit, decimalPlaces]);

        React.useEffect(() => {
            setDisplayValue(formatValue(value));
        }, []);

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            setDisplayValue(value.toString());
            props.onFocus?.(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);

            const numericValue = parseValue(displayValue);
            let finalValue = numericValue;

            if (!allowNegative && finalValue < 0) {
                finalValue = 0;
            }

            if (minValue !== undefined && finalValue < minValue) {
                finalValue = minValue;
            }
            if (maxValue !== undefined && finalValue > maxValue) {
                finalValue = maxValue;
            }

            if (isNaN(finalValue) || finalValue === null || finalValue === undefined) {
                finalValue = 0;
            }

            setDisplayValue(formatValue(finalValue));

            if (onChange && finalValue !== value) {
                onChange(finalValue);
            }

            props.onBlur?.(e);
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;

            if (isFocused) {
                if (newValue === '' || /^-?\d*[.,]?\d*$/.test(newValue)) {
                    setDisplayValue(newValue);
                }
            } else {
                setDisplayValue(newValue);
            }
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                e.currentTarget.blur();
            }
            props.onKeyDown?.(e);
        };

        return (
            <Input
                {...props}
                ref={ref}
                value={displayValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={getPlaceholder()}
                inputMode="decimal"
                autoComplete="off"
            />
        );
    }
);

NumberInput.displayName = "NumberInput";

const MoneyInput = React.forwardRef<HTMLInputElement, Omit<NumberInputProps, 'inputType'>>(
    (props, ref) => {
        return <NumberInput {...props} inputType="money" ref={ref} />;
    }
);

MoneyInput.displayName = "MoneyInput";

export { NumberInput, MoneyInput };

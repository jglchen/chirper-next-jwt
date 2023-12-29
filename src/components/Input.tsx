import { ComponentPropsWithoutRef } from 'react';

interface InputProps extends ComponentPropsWithoutRef<'input'> {
    disabled?: boolean;
    className: string;
}

const Input = ({ disabled = false, className, ...props }: InputProps) => (
    <input
        disabled={disabled}
        className={`${className} p-2 text-base text-gray-700 dark:text-gray-200 dark:bg-[#2C303B] rounded-md shadow-sm border border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
        {...props}
    />
)

export default Input


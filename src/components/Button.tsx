import { ComponentPropsWithoutRef } from 'react';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
    type?: 'submit' | 'button' | 'reset' | undefined;
    className?: string;
    disabled?: boolean;
}

const Button = ({ type = 'submit', className = '', disabled = false, ...props }: ButtonProps) => (
    <button
        type={type}
        className={`${className} ${disabled && 'opacity-25'} inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150`}
        {...props}
    />
)

export default Button

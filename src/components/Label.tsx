import { HTMLAttributes, ComponentPropsWithoutRef } from 'react';

/*
interface LabelProps extends HTMLAttributes<HTMLLabelElement> {
   className?: string;
   htmlFor: string;
}*/

interface LabelProps extends ComponentPropsWithoutRef<'label'> {
    className?: string;
    htmlFor: string;
}

const Label = ({ className, children, ...props }: LabelProps) => (
    <label
        className={`${className ? className: ''} block font-medium text-sm text-gray-700 dark:text-gray-200`}
        {...props}>
        {children}
    </label>
)

export default Label

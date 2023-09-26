import Link, { LinkProps }  from 'next/link'
import { Menu } from '@headlessui/react';
import { ComponentPropsWithoutRef } from 'react';

interface NextLinkProps extends LinkProps{
    children: JSX.Element | string;
}    

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
}

export const DropdownLink = ({ children, ...props }: NextLinkProps) => (
    <Menu.Item>
        {({ active }) => (
            <Link
                {...props}
                className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
                    active ? 'bg-gray-100' : ''
                } focus:outline-none transition duration-150 ease-in-out`}>
                {children}
            </Link>
        )}
    </Menu.Item>
)

export const DropdownButton = ({ children, ...props }: ButtonProps) => (
    <Menu.Item>
        {({ active }) => (
            <button
                className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
                    active ? 'bg-gray-100' : ''
                } focus:outline-none transition duration-150 ease-in-out`}
                {...props}>
                {children}
            </button>
        )}
    </Menu.Item>
)

export default DropdownLink

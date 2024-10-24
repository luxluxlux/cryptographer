import { memo, MouseEventHandler, ReactNode } from 'react';
import { clsx } from 'clsx';

interface IProps {
    children?: string;
    // FIXME Rename to avoid conficts with native naming
    style?: 'primary' | 'secondary';
    icon?: string;
    title?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button = memo(({ children, style = 'primary', icon, title, onClick }: IProps) => (
    <button
        className={clsx('button', `button_${style}`, icon && `button_icon`)}
        title={title}
        onClick={onClick}
    >
        {/* FIXME Temporary solution, move to background CSS-property */}
        {icon && <img className='button__icon' src={icon} alt='' />}
        {children}
    </button>
));

export default Button;
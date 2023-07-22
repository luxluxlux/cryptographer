import { memo, MouseEventHandler } from 'react';
import { clsx } from 'clsx';

interface IProps {
    children: string;
    color?: 'primary' | 'secondary';
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button = memo(({ children, color = 'primary', onClick }: IProps) => (
    <button className={clsx('button', color && `button_${color}`)} onClick={onClick}>{children}</button>
));

export default Button;
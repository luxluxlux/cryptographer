import { memo, MouseEventHandler } from 'react';
import { clsx } from 'clsx';

interface IProps {
    children: string;
    style?: 'primary' | 'secondary';
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button = memo(({ children, style = 'primary', onClick }: IProps) => (
    <button className={clsx('button', `button_${style}`)} onClick={onClick}>{children}</button>
));

export default Button;
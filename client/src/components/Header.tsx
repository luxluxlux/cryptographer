import { memo } from 'react';
import { clsx } from 'clsx';

interface IProps {
    children: string;
    type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    color?: 'default' | 'error';
}

const Header = memo(({ children, type: Element = 'h1', color = 'default' }: IProps) => (
    <Element className={clsx('header', color !== 'default' && `header_${color}`)}>{children}</Element>
));

export default Header;
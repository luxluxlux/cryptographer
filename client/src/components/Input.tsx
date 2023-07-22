import { memo, forwardRef } from 'react';

interface IProps {
    type?: string;
    placeholder?: string;
}

const Input = forwardRef<HTMLInputElement, IProps>(({ type, placeholder }, ref) => (
    <input ref={ref} className="input" autoComplete="off" type={type} placeholder={placeholder}/>
));

export default Input;
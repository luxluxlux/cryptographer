import { memo, forwardRef, HTMLProps } from 'react';

const Input = memo(
    forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>((props, ref) => (
        <input ref={ref} className="input" autoComplete="off" {...props} />
    ))
);

export default Input;

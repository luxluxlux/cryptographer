import { memo, forwardRef, HTMLProps } from 'react';

const Input = forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>((props, ref) => (
    <input ref={ref} className="input" autoComplete="off" {...props} />
));

Input.displayName = 'Input';

export default memo(Input);

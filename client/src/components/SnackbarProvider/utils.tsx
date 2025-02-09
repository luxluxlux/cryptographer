import { ComponentProps, forwardRef } from 'react';
import Component from './Component';

export function getComponentWithVariant(variant: ComponentProps<typeof Component>['variant']) {
    return forwardRef<HTMLDivElement, ComponentProps<typeof Component>>(
        function WrappedComponent(props, ref) {
            return <Component {...props} ref={ref} variant={variant} />;
        }
    );
}

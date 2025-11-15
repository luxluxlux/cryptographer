import { ComponentProps, forwardRef } from 'react';
import Component from './Component';

/**
 * Returns a React component with the specified variant.
 * @param variant The variant of the component.
 * @returns The component with the specified variant.
 */
export function getComponentWithVariant(variant: ComponentProps<typeof Component>['variant']) {
    return forwardRef<HTMLDivElement, ComponentProps<typeof Component>>(
        function WrappedComponent(props, ref) {
            return <Component {...props} ref={ref} variant={variant} />;
        }
    );
}


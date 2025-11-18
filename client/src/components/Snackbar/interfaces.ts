import { ReactNode } from 'react';
import {
    ProviderContext as ProviderContextNotistack,
    EnqueueSnackbar as EnqueueSnackbarNotistack,
    OptionsObject as OptionsObjectNotistack,
    VariantType as VariantTypeNotistack,
    VariantMap as VariantMapNotistack,
    SnackbarMessage as SnackbarMessageNotistack,
    SnackbarKey as SnackbarKeyNotistack,
    CustomContentProps,
} from 'notistack';

/**
 * Snackbar provider properties.
 */
export interface ISnackbarProviderProps {
    /**
     * Provider content.
     */
    children: ReactNode;
}

/**
 * Snackbar component properties.
 */
export interface IComponentProps extends CustomContentProps {
    /**
     * Alert title.
     */
    title?: string;
    /**
     * Alert variant.
     */
    variant: 'error' | 'success' | 'warning' | 'info';
}

export interface OptionsObject<V extends VariantTypeNotistack = VariantTypeNotistack>
    extends OptionsObjectNotistack<V> {
    /**
     * Custom alert title.
     */
    title?: string;
}

export type OptionsWithExtraProps<V extends VariantTypeNotistack> =
    VariantMapNotistack[V] extends true
    ? OptionsObject<V>
    : OptionsObject<V> & VariantMapNotistack[V];

export interface EnqueueSnackbar extends EnqueueSnackbarNotistack {
    <V extends VariantTypeNotistack>(
        options: OptionsWithExtraProps<V> & { message?: SnackbarMessageNotistack }
    ): SnackbarKeyNotistack;
    <V extends VariantTypeNotistack>(
        message: SnackbarMessageNotistack,
        options?: OptionsWithExtraProps<V>
    ): SnackbarKeyNotistack;
}

/**
 * Custom snackbar provider context.
 */
export interface ProviderContext extends ProviderContextNotistack {
    enqueueSnackbar: EnqueueSnackbar;
}

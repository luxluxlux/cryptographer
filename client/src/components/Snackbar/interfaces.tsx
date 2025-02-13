import {
    ProviderContext as ProviderContextNotistack,
    EnqueueSnackbar as EnqueueSnackbarNotistack,
    OptionsObject as OptionsObjectNotistack,
    VariantType as VariantTypeNotistack,
    VariantMap as VariantMapNotistack,
    SnackbarMessage as SnackbarMessageNotistack,
    SnackbarKey as SnackbarKeyNotistack,
} from 'notistack';

export interface OptionsObject<V extends VariantTypeNotistack = VariantTypeNotistack>
    extends OptionsObjectNotistack<V> {
    /**
     * Custom alert title
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

export interface ProviderContext extends ProviderContextNotistack {
    enqueueSnackbar: EnqueueSnackbar;
}

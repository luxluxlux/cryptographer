import { useSnackbar as useNotistack } from 'notistack';
import { ProviderContext } from './interfaces';

/**
 * Controls the visibility of snackbars.
 * @remarks Use this hook instead of notistack's useSnackbar since it supports custom content.
 * @returns Notification controls.
 */
export const useSnackbar = useNotistack as () => ProviderContext;
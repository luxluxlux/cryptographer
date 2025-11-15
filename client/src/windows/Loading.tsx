import { memo } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * The properties for the loading component.
 */
export interface IProps {
    /**
     * Custom waiting label.
     * @defaultValue Loading, please wait...
     */
    title?: string;
}

/**
 * Loading overlay.
 * @param props The properties for the loading component.
 * @return The loading component.
 */
export const Loading = ({ title = 'Loading, please wait...' }: IProps) => (
    <div className="loading">
        <CircularProgress color="inherit" size={60} />
        <div>{title}</div>
    </div>
);

Loading.displayName = 'Loading';

export default memo(Loading);

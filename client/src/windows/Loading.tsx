import CircularProgress from '@mui/material/CircularProgress';

interface IProps {
    title?: string;
}

const Loading = ({ title = 'Loading, please wait...' }: IProps) => (
    <div className="loading">
        <CircularProgress color="inherit" size={60} />
        <div>{title}</div>
    </div>
);

Loading.displayName = 'Loading';

export default Loading;

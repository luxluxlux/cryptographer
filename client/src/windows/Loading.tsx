import loading from 'resources/loading.svg';

interface IProps {
    title?: string;
}

// TODO Use as decorative image
const Loading = ({ title = 'Loading, please wait...' }: IProps) => (
    <div className="loading">
        <img className="loading__image" src={loading} alt="Loading" />
        <div>{title}</div>
    </div>
);

Loading.displayName = 'Loading';

export default Loading;

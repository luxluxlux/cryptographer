import video from 'resources/video.mp4';

const Background = () => (
    <video autoPlay muted loop playsInline className="background">
        <source src={video} type="video/mp4" />
    </video>
);

export default Background;
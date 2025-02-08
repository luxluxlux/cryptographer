import { ReactNode, memo } from 'react';
import { useLocation } from 'react-router-dom';
import WindowManager from 'components/WindowManager';
import DropArea from 'components/DropArea';
import { PATH, PATH_STAGE, STAGE_DATA } from 'utils/constants';

interface IProps {
    logo: ReactNode;
    menu: ReactNode;
    footer: ReactNode;
    stage: ReactNode;
    content: ReactNode;
}

const Base = (props: IProps) => {
    const location = useLocation();
    const stage = PATH_STAGE[location.pathname as PATH];

    return (
        <div className="base">
            <WindowManager>
                <DropArea>
                    {/* TODO Group to the background */}
                    <div className="base__gradient">
                        <div className="base__gradient-left" />
                        <div className="base__gradient-right" />
                    </div>
                    <div className="base__blur-left" />
                    <div className="base__blur-right" />
                    <div className="base__blur-bottom" />
                    <div className="base__glow" />
                    <div
                        className="base__overlay"
                        style={{
                            // FIXME Use id, not key
                            backgroundColor: STAGE_DATA[stage].color,
                        }}
                    />
                    <header>
                        <div className="base__header">
                            <div>{props.logo}</div>
                            <div>{props.menu}</div>
                        </div>
                    </header>
                    <main>
                        <div className="base__body">
                            <div className="base__body-stage">{props.stage}</div>
                            <div className="base__body-content">{props.content}</div>
                        </div>
                    </main>
                    <footer>
                        <div className="base__footer">{props.footer}</div>
                    </footer>
                </DropArea>
            </WindowManager>
        </div>
    );
};

Base.displayName = 'Base';

export default memo(Base);

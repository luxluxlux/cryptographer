import { ReactNode, memo } from 'react';
import { useLocation } from 'react-router-dom';
import WindowManager from 'components/WindowManager';
import DropArea from 'components/DropArea';
import { PATH, PATH_STAGE, STAGE_DATA } from 'utils/constants';
import { BREAKPOINT, useBreakpoint } from 'utils/breakpoints';
import DesktopBackground from './DesktopBackground';
import MobileBackground from './MobileBackground';

interface IProps {
    logo: ReactNode;
    menu: ReactNode;
    footer: ReactNode;
    stage: ReactNode;
    content: ReactNode;
}

const Base = (props: IProps) => {
    const isDesktop = useBreakpoint(BREAKPOINT.S);
    const location = useLocation();
    const stage = PATH_STAGE[location.pathname as PATH];
    const color = STAGE_DATA[stage].color;

    return (
        <div className="base">
            <WindowManager>
                <DropArea>
                    {isDesktop ? (
                        <DesktopBackground color={color} />
                    ) : (
                        <MobileBackground color={color} />
                    )}
                    <header>
                        <div className="base__header">
                            <div>{props.logo}</div>
                            <div>{props.menu}</div>
                        </div>
                    </header>
                    <main>
                        <div className="base__body">
                            {isDesktop ? (
                                <>
                                    <div className="base__body-stage">{props.stage}</div>
                                    <div className="base__body-content">{props.content}</div>
                                </>
                            ) : (
                                props.content
                            )}
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

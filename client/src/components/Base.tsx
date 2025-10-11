import { CSSProperties, ReactNode, memo } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { STAGE_DATA } from 'utils/constants';
import { isMobile } from 'utils/device';
import { WindowManager } from 'components/WindowManager';
import DropArea from 'components/DropArea';

interface IProps {
    logo: ReactNode;
    menu: ReactNode;
    footer: ReactNode;
    content: ReactNode;
}

const Base = (props: IProps) => {
    const location = useLocation();
    const color = Object.values(STAGE_DATA).find(
        (value) => value.path === location.pathname
    )?.color;

    return (
        <div
            className="base"
            style={
                {
                    '--primary-color': color,
                } as CSSProperties
            }
        >
            <WindowManager>
                <DropArea>
                    <div className="base__background" />
                    <div className="base__overlay" />
                    <div className="base__content">
                        <header
                            className={clsx(
                                'base__content-header',
                                isMobile() && 'base__content-header_mobile'
                            )}
                        >
                            <div>{props.logo}</div>
                            <div>{props.menu}</div>
                        </header>
                        <main className="base__content-body">
                            <div className="base__content-body-content">{props.content}</div>
                        </main>
                        <footer
                            className={clsx(
                                'base__content-footer',
                                isMobile() && 'base__content-footer_mobile'
                            )}
                        >
                            {props.footer}
                        </footer>
                    </div>
                </DropArea>
            </WindowManager>
        </div>
    );
};

Base.displayName = 'Base';

export default memo(Base);

import { CSSProperties, memo } from 'react';
import clsx from 'clsx';
import { isMobile } from 'utils/device';
import { WindowManager } from 'components/WindowManager';
import DropArea from 'components/DropArea';
import { IPageProps } from './interfaces';
import { usePrimaryColor } from './hooks';

/**
 * Basic page layout
 * @param props The props for the page
 * @return The rendered page
 */
const Page = (props: IPageProps) => {
    const color = usePrimaryColor();
    return (
        <div
            className="page"
            style={
                {
                    '--primary-color': color,
                } as CSSProperties
            }
        >
            <WindowManager>
                <DropArea>
                    <div className="page__background" />
                    <div className="page__overlay" />
                    <div className="page__content">
                        <header
                            className={clsx(
                                'page__content-header',
                                isMobile() && 'page__content-header_mobile'
                            )}
                        >
                            <div>{props.logo}</div>
                            <div>{props.menu}</div>
                        </header>
                        <main className="page__content-body">
                            <div className="page__content-body-content">{props.content}</div>
                        </main>
                        <footer
                            className={clsx(
                                'page__content-footer',
                                isMobile() && 'page__content-footer_mobile'
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

Page.displayName = 'Page';

export default memo(Page);

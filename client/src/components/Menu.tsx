import { memo, useContext, useCallback } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { WindowManagerContext } from 'utils/contexts';
import HowItWorks from 'windows/HowItWorks';
import About from 'windows/About';

const Menu = () => {
    const windowContext = useContext(WindowManagerContext);

    const handleHowItWorksClick = useCallback(() => {
        windowContext.open(<HowItWorks />);
    }, [windowContext.open]);

    const handleAboutClick = useCallback(() => {
        windowContext.open(<About />);
    }, [windowContext.open]);

    return (
        <nav>
            <List className="menu__list" sx={{ padding: 'unset', gap: 'var(--offset_2xl)' }}>
                <ListItem sx={{ padding: 'unset' }}>
                    <ListItemButton sx={{ padding: 'unset' }} onClick={handleHowItWorksClick}>
                        <ListItemText primary="How&nbsp;it&nbsp;works" />
                    </ListItemButton>
                </ListItem>
                <ListItem sx={{ padding: 'unset' }}>
                    <ListItemButton sx={{ padding: 'unset' }} onClick={handleAboutClick}>
                        <ListItemText primary="About" />
                    </ListItemButton>
                </ListItem>
            </List>
        </nav>
    );
};

Menu.displayName = 'Menu';

export default memo(Menu);

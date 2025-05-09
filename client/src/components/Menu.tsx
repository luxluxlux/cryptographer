import { memo, useContext, useCallback, useState, MouseEvent } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MuiMenu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import QuizIcon from '@mui/icons-material/Quiz';
import InfoIcon from '@mui/icons-material/Info';
import { WindowManagerContext } from 'utils/contexts';
import { BREAKPOINT, useBreakpoint } from 'utils/breakpoints';
import HowItWorks from 'windows/HowItWorks';
import FAQ from 'windows/FAQ';
import About from 'windows/About';

const Menu = () => {
    const isDesktop = useBreakpoint(BREAKPOINT.S);
    const windowContext = useContext(WindowManagerContext);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleHowItWorksClick = useCallback(() => {
        windowContext.open(<HowItWorks />);
    }, [windowContext.open]);

    const handleFAQClick = useCallback(() => {
        windowContext.open(<FAQ />);
    }, [windowContext.open]);

    const handleAboutClick = useCallback(() => {
        windowContext.open(<About />);
    }, [windowContext.open]);

    const handleOpenMenu = useCallback((event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <nav>
            {isDesktop ? (
                <List className="menu__list">
                    <ListItem className="menu__list-item">
                        <ListItemButton
                            className="menu__list-item-button"
                            onClick={handleHowItWorksClick}
                        >
                            <ListItemText primary="How&nbsp;it&nbsp;works" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem className="menu__list-item">
                        <ListItemButton className="menu__list-item-button" onClick={handleFAQClick}>
                            <ListItemText primary="FAQ" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem className="menu__list-item">
                        <ListItemButton
                            className="menu__list-item-button"
                            onClick={handleAboutClick}
                        >
                            <ListItemText primary="About" />
                        </ListItemButton>
                    </ListItem>
                </List>
            ) : (
                <>
                    <IconButton onClick={handleOpenMenu}>
                        <MenuIcon fontSize="medium" />
                    </IconButton>
                    <MuiMenu
                        anchorEl={anchorEl}
                        open={!!anchorEl}
                        onClose={handleCloseMenu}
                        onClick={handleCloseMenu}
                    >
                        <MenuItem divider onClick={handleHowItWorksClick}>
                            <ListItemIcon>
                                <SettingsSuggestIcon fontSize="small" />
                            </ListItemIcon>
                            How it works
                        </MenuItem>
                        <MenuItem divider onClick={handleFAQClick}>
                            <ListItemIcon>
                                <QuizIcon fontSize="small" />
                            </ListItemIcon>
                            FAQ
                        </MenuItem>
                        <MenuItem onClick={handleAboutClick}>
                            <ListItemIcon>
                                <InfoIcon fontSize="small" />
                            </ListItemIcon>
                            About
                        </MenuItem>
                    </MuiMenu>
                </>
            )}
        </nav>
    );
};

Menu.displayName = 'Menu';

export default memo(Menu);

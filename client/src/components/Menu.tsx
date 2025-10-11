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
import { isMobile } from 'utils/device';
import { WindowManagerContext, WINDOW } from 'components/WindowManager';

const Menu = () => {
    const windowContext = useContext(WindowManagerContext);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleHowItWorksClick = useCallback(() => {
        windowContext.open(WINDOW.HOW_IT_WORKS);
    }, [windowContext.open]);

    const handleFAQClick = useCallback(() => {
        windowContext.open(WINDOW.FAQ);
    }, [windowContext.open]);

    const handleAboutClick = useCallback(() => {
        windowContext.open(WINDOW.ABOUT);
    }, [windowContext.open]);

    const handleOpenMenu = useCallback((event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <nav>
            {isMobile() ? (
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
            ) : (
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
            )}
        </nav>
    );
};

Menu.displayName = 'Menu';

export default memo(Menu);

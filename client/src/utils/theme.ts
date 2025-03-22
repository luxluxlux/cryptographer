import { unstable_createBreakpoints } from "@mui/system/createBreakpoints";
import { createTheme } from '@mui/material/styles';

const breakpoints = unstable_createBreakpoints({});

// TODO Is it possible to use it as CSS?
// https://mui.com/material-ui/integrations/interoperability/#global-css
export default createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: 'unset',
        button: {
            textTransform: 'none',
        },
    },
    components: {
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    variants: [
                        {
                            props: { invisible: false },
                            style: {
                                backdropFilter: 'var(--blur-filter)',
                            },
                        },
                    ],
                },
            },
        },
        // TODO Enable ripple for all type of buttons except text
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    "&:hover": {
                        backgroundColor: 'transparent',
                    }
                }
            },
            defaultProps: {
                disableRipple: true,
            },
        },
        MuiButton: {
            styleOverrides: {
                // FIXME Use variants
                // https://mui.com/material-ui/customization/theme-components/?srsltid=AfmBOopdfKgVx0BA_5PTkrcKEEfrKO_4by5-Lf0CWtuZPBZ1B5XDTv1h#variants
                root: ({ ownerState }) => {
                    const common = {
                        color: 'inherit',
                        fontSize: 'var(--font-size_m)',
                        fontWeight: 'inherit',
                    };
                    switch (ownerState.variant) {
                        case 'outlined':
                            return {
                                ...common,
                                borderColor: 'unset',
                                borderRadius: 'var(--border-radius-infinity)',
                                padding: '6px 40px',
                                minWidth: 150,
                                "&:hover": {
                                    backgroundColor: 'var(--button-outlined-hover-color)',
                                }
                            }
                        case 'contained':
                            return {
                                ...common,
                                color: 'var(--button-text-color)',
                                backgroundColor: 'var(--button-color)',
                                boxShadow: 'unset',
                                // Compensation for the border
                                border: '1px solid transparent',
                                borderRadius: 'var(--border-radius-infinity)',
                                padding: '6px 35px',
                                minWidth: 150,
                                "&:hover": {
                                    backgroundColor: 'var(--button-contained-hover-color)',
                                    boxShadow: 'unset',
                                }
                            }
                    }
                }
            },
        },
        // TODO Enable after button ripple is enabled
        MuiIconButton: {
            defaultProps: {
                disableRipple: true,
            },
        },
        MuiStepLabel: {
            styleOverrides: {
                label: {
                    fontSize: 'unset',
                    // FIXME Remove CSS classes
                    '&.Mui-completed': {
                        fontWeight: 'unset',
                    },
                    '&.Mui-active': {
                        fontWeight: 'bold',
                    },
                    '&.Mui-disabled': {
                        color: 'var(--text-readonly-color)',
                    },
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    padding: 'unset',
                },
            },
        },
        MuiFormControlLabel: {
            styleOverrides: {
                root: {
                    margin: 0,
                    gap: 'var(--offset_xs)',
                },
            },
            defaultProps: {
                disableTypography: true,
            }
        },
        MuiMenu: {
            styleOverrides: {
                list: {
                    padding: 'unset',
                },
                paper: {
                    backgroundColor: 'var(--menu-color)',
                    backgroundImage: 'unset',
                    backdropFilter: 'var(--blur-filter)',
                    fontSize: 'var(--font-size_s)',
                    borderRadius: 'var(--border-radius-m)',
                }
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontSize: 'var(--font-size_s)',
                    [breakpoints.up('sm')]: {
                        minHeight: 42,
                    },
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    variants: [
                        {
                            props: (props) => props.onClick,
                            style: {
                                cursor: 'pointer',
                            },
                        },
                    ],
                },
            },
            defaultProps: {
                color: 'inherit',
            },
        }
    },
});
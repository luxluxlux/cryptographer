import { createTheme } from '@mui/material/styles';

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
                                backdropFilter: 'blur(20px)',
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
                        case 'text':
                            return {
                                ...common,
                                textDecoration: 'underline',
                                padding: 'unset',
                                verticalAlign: 'unset',
                                "&:hover": {
                                    backgroundColor: 'unset',
                                    textDecoration: 'underline',
                                }
                            }
                        case 'outlined':
                            return {
                                ...common,
                                borderColor: 'unset',
                                borderRadius: 'var(--border-radius-infinity)',
                                padding: '6px 40px',
                                minWidth: '150px',
                                "&:hover": {
                                    backgroundColor: 'var(--button-outlined-hover-color)',
                                }
                            }
                        case 'contained':
                            return {
                                ...common,
                                backgroundColor: 'var(--button-color)',
                                boxShadow: 'unset',
                                // Compensation for the border
                                border: '1px solid transparent',
                                borderRadius: 'var(--border-radius-infinity)',
                                padding: '6px 40px',
                                minWidth: '150px',
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
                paper: {
                    backgroundColor: 'var(--menu-color)',
                    fontSize: 'var(--font-size_s)',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontSize: 'var(--font-size_s)',
                },
            },
        },
        MuiLink: {
            defaultProps: {
                color: 'inherit',
            },
        }
    },
});
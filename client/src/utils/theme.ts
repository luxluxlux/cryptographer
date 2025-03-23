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
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },
        },
        MuiButton: {
            styleOverrides: {
                root: () => {
                    const common = {
                        color: 'inherit',
                        fontSize: 'var(--font-size_m)',
                        fontWeight: 'inherit',
                        minWidth: 150,
                        borderRadius: 'var(--border-radius-infinite)',
                        padding: '6px 34px',
                    };
                    return {
                        variants: [
                            {
                                props: { variant: 'outlined' },
                                style: {
                                    ...common,
                                    borderColor: 'unset',
                                    "&:hover": {
                                        backgroundColor: 'var(--button-outlined-hover-color)',
                                    },
                                    '&:focus-visible': {
                                        backgroundColor: 'var(--button-outlined-focus-color)',
                                    },
                                },
                            },
                            {
                                props: { variant: 'contained' },
                                style: {
                                    ...common,
                                    color: 'var(--button-text-color)',
                                    backgroundColor: 'var(--button-color)',
                                    boxShadow: 'unset',
                                    // Compensation for the border
                                    border: '1px solid transparent',
                                    "&:hover": {
                                        backgroundColor: 'var(--button-contained-hover-color)',
                                        boxShadow: 'unset',
                                    },
                                    '&:focus-visible': {
                                        backgroundColor: 'var(--button-contained-focus-color)',
                                        boxShadow: 'unset',
                                    },
                                },
                            },
                        ],
                    }
                }
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    '&:focus-visible': {
                        backgroundColor: 'var(--button-text-focus-color)',
                    },
                },
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
                    cursor: 'pointer',
                    verticalAlign: 'unset',
                    '&:focus-visible': {
                        outline: 'none',
                        border: 'none',
                        borderRadius: 'var(--border-radius-infinite)',
                        backgroundColor: 'var(--button-text-focus-color)',
                    },
                },
            },
            defaultProps: {
                color: 'inherit',
            },
        },
        MuiInput: {
            styleOverrides: {
                root: {
                    '&::after': {
                        borderBottom: '2px solid var(--input-focus-border-color)',
                    },
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 'var(--border-radius-l)',
                },
            },
        }
    },
});
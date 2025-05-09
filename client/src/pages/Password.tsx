import { memo, useCallback, useState, useContext, ChangeEvent } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useSnackbar } from 'components/Snackbar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CachedIcon from '@mui/icons-material/Cached';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
    MIN_PASSWORD_LENGTH,
    MAX_PASSWORD_LENGTH,
    MAX_ALERT_FILENAME_LENGTH,
} from 'utils/constants';
import { ellipse, upload, validateFile, wait } from 'utils/common';
import { WindowManagerContext } from 'utils/contexts';
import { crypt } from 'utils/crypto/core';
import Loading from 'windows/Loading';
import LicenseAgreement from 'windows/LicenseAgreement';

// TODO: Rename
const Password = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const windowContext = useContext(WindowManagerContext);

    const [password, setPassword] = useState<string | null>(null);
    const [passwordIsVisible, setPasswordIsVisible] = useState<boolean>(false);

    const handleFileClick = useCallback(async () => {
        try {
            const file = await upload();
            const validation = validateFile(file);
            if (validation !== true) {
                enqueueSnackbar({
                    variant: 'warning',
                    title: 'Unable to upload file',
                    message: (
                        <>
                            <strong>{ellipse(file.name, MAX_ALERT_FILENAME_LENGTH)}</strong>{' '}
                            isn&apos;t uploaded. {validation}
                        </>
                    ),
                });
                return;
            }
            navigate('/password', { state: { file } });
        } catch (error) {
            enqueueSnackbar({
                variant: 'error',
                title: 'Failed to upload file',
                message: 'Something went wrong. Please try again.',
            });
            console.error(error);
        }
    }, []);

    const handlePasswordChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }, []);

    const handleTogglePassword = useCallback(() => {
        setPasswordIsVisible((isVisible) => !isVisible);
    }, []);

    const handleClickAgreement = useCallback(() => {
        windowContext.open(<LicenseAgreement />);
    }, []);

    const handleCrypt = useCallback(
        async (action: 'encrypt' | 'decrypt') => {
            const validation = validatePassword(password);
            if (validation !== true) {
                enqueueSnackbar({
                    variant: 'warning',
                    title: `Unable to ${action} file`,
                    message: validation,
                });
                return;
            }

            windowContext.open(<Loading title="File processing, please wait..." />, {
                modal: true,
                closable: false,
            });
            const file = location.state.file;
            try {
                const result = await Promise.allSettled([
                    crypt(action, file, password!),
                    // Give the user some time to think about the universe
                    wait(1000),
                ]);
                if (result[0].status === 'rejected') {
                    throw result[0].reason;
                }
                const data = result[0].value;
                navigate('/success', {
                    state: {
                        data: new Blob([data], { type: file.type }),
                        fileName: file.name,
                        action,
                    },
                });
            } catch (error) {
                enqueueSnackbar({
                    variant: 'error',
                    message:
                        action === 'encrypt'
                            ? 'Check if the file is damaged or replace it with another one.'
                            : 'Check that the password or key is correct and make sure the file is not damaged.',
                    title: `Failed to ${action} file`,
                });
                console.error(error);
            } finally {
                windowContext.close();
            }
        },
        [location.state, navigate, password]
    );

    const handleEncryptClick = useCallback(() => handleCrypt('encrypt'), [handleCrypt]);

    const handleDecryptClick = useCallback(() => handleCrypt('decrypt'), [handleCrypt]);

    if (!location.state) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="password">
            <div className="password__inputs">
                {/* TODO: Add ellipsis */}
                <Input
                    value={location.state.file.name}
                    title={location.state.file.name}
                    inputProps={{ tabIndex: -1 }}
                    readOnly
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                title="Change the file"
                                onClick={handleFileClick}
                            >
                                <CachedIcon fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    }
                />
                <Input
                    type={passwordIsVisible ? 'text' : 'password'}
                    placeholder="Enter the password"
                    value={password}
                    autoFocus
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                title={passwordIsVisible ? 'Hide password' : 'Show password'}
                                onClick={handleTogglePassword}
                            >
                                {passwordIsVisible ? (
                                    <VisibilityOffIcon fontSize="small" />
                                ) : (
                                    <VisibilityIcon fontSize="small" />
                                )}
                            </IconButton>
                        </InputAdornment>
                    }
                    onChange={handlePasswordChanged}
                />
            </div>
            <div className="password__agreement">
                <span>By continuing, you agree to </span>
                {/* Avoid word wrap on narrow screens */}
                <Link
                    className="password__agreement-link"
                    component={'button'}
                    onClick={handleClickAgreement}
                >
                    the license terms
                </Link>
                <span>.</span>
            </div>
            {/* TODO: Add hints for empty password or key */}
            <div className="password__actions">
                <Button variant="contained" disabled={!password} onClick={handleEncryptClick}>
                    Encrypt
                </Button>
                <Button variant="outlined" disabled={!password} onClick={handleDecryptClick}>
                    Decrypt
                </Button>
            </div>
        </div>
    );
};

function validatePassword(password: string | null): true | string {
    if (!password) {
        return 'The password is empty.';
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
        return `Password must contain at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    if (password.length > MAX_PASSWORD_LENGTH) {
        return `Password must contain no more than ${MAX_PASSWORD_LENGTH} characters.`;
    }

    return true;
}

Password.displayName = 'Password';

export default memo(Password);

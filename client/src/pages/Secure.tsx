import { useCallback, useState, useContext, ChangeEvent } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'components/Snackbar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CachedIcon from '@mui/icons-material/Cached';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { Action, ValidationResult } from 'utils/interfaces';
import {
    MIN_PASSWORD_LENGTH,
    MAX_PASSWORD_LENGTH,
    MAX_ALERT_FILENAME_LENGTH,
    MAX_FILES_SIZE_MB,
    STAGE_DATA,
    STAGE,
    FILE_EXTENSION,
    APPLICATION_NAME,
} from 'utils/constants';
import {
    addExtension,
    changeExtension,
    ellipse,
    upload,
    validateDisguise,
    validateFile,
    wait,
} from 'utils/common';
import { encryptFile, decryptFile } from 'utils/crypto/core';
import { WindowManagerContext, WINDOW } from 'components/WindowManager';
import Loading from 'windows/Loading';

/**
 * Encryption settings page.
 * @returns The page for setting up password, disguising, etc.
 */
const Secure = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const windowContext = useContext(WindowManagerContext);

    const [password, setPassword] = useState<string | null>(null);
    const [passwordIsVisible, setPasswordIsVisible] = useState<boolean>(false);

    const handleUploadFileClick = useCallback(async () => {
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
            navigate(STAGE_DATA[STAGE.SECURE].path, { state: { ...location.state, file } });
        } catch (error) {
            enqueueSnackbar({
                variant: 'error',
                title: 'Failed to upload file',
                message: 'Something went wrong. Please try again.',
            });
            console.error(error);
        }
    }, [location, enqueueSnackbar]);

    const handleUploadDisguiseClick = useCallback(async () => {
        try {
            const disguise = await upload();
            const validation = validateDisguise(disguise, location.state.file);
            if (validation !== true) {
                enqueueSnackbar({
                    variant: 'warning',
                    title: 'Unable to upload disguise',
                    message: (
                        <>
                            <strong>{ellipse(disguise.name, MAX_ALERT_FILENAME_LENGTH)}</strong>{' '}
                            isn&apos;t uploaded as disguise. {validation}
                        </>
                    ),
                });
                return;
            }
            navigate(STAGE_DATA[STAGE.SECURE].path, {
                state: { ...location.state, disguise },
            });
        } catch (error) {
            enqueueSnackbar({
                variant: 'error',
                title: 'Failed to upload disguise',
                message: 'Something went wrong. Please try again.',
            });
            console.error(error);
        }
    }, [location, enqueueSnackbar]);

    const handleRemoveDisguiseClick = useCallback(async () => {
        const { disguise: _, ...explicitState } = location.state;
        navigate(STAGE_DATA[STAGE.SECURE].path, { state: explicitState });
    }, [location]);

    const handlePasswordChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }, []);

    const handleTogglePassword = useCallback(() => {
        setPasswordIsVisible((isVisible) => !isVisible);
    }, []);

    const handleClickAgreement = useCallback(() => {
        windowContext.open(WINDOW.LICENSE_AGREEMENT);
    }, [windowContext.open]);

    const handleCrypt = useCallback(
        async (action: Action) => {
            const passwordValidation = validatePassword(password);
            if (passwordValidation !== true) {
                enqueueSnackbar({
                    variant: 'warning',
                    title: `Unable to ${action} file`,
                    message: passwordValidation,
                });
                return;
            }

            windowContext.open(<Loading title="File processing, please wait..." />, {
                modal: true,
                closable: false,
            });
            const file = location.state.file;
            const disguise = location.state.disguise;
            try {
                const result = await Promise.allSettled([
                    action === 'encrypt'
                        ? encryptFile(file, password!, disguise)
                        : decryptFile(file, password!),
                    // Give the user some time to think about the universe
                    wait(1000),
                ]);
                if (result[0].status === 'rejected') {
                    throw result[0].reason;
                }

                const value = result[0].value;
                const fileName =
                    'data' in value
                        ? value.name
                            ? addExtension(value.name, value.extension)
                            : changeExtension(file.name, value.extension)
                        : disguise
                          ? disguise.name
                          : changeExtension(file.name, FILE_EXTENSION);
                const data = 'data' in value ? value.data : value;
                const blob = new Blob([data]);

                const blobValidation = validateBlob(action, blob);
                if (blobValidation !== true) {
                    enqueueSnackbar({
                        variant: 'warning',
                        title: `Unable to ${action} file`,
                        message: blobValidation,
                    });
                    return;
                }

                navigate(STAGE_DATA[STAGE.DOWNLOAD].path, {
                    state: {
                        fileName,
                        data: blob,
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
        [location, enqueueSnackbar, windowContext.open, windowContext.close, password]
    );

    const handleEncryptClick = useCallback(() => handleCrypt('encrypt'), [handleCrypt]);

    const handleDecryptClick = useCallback(() => handleCrypt('decrypt'), [handleCrypt]);

    if (!location.state) {
        return (
            <Navigate
                to={{
                    pathname: STAGE_DATA[STAGE.UPLOAD].path,
                    search: location.search,
                }}
                replace
            />
        );
    }

    return (
        <>
            <Helmet>
                <title>{APPLICATION_NAME} | Secure</title>
                <meta name="robots" content="noindex" />
            </Helmet>
            <div className="secure">
                <div className="secure__inputs">
                    <Input
                        value={location.state.file.name}
                        title={location.state.file.name}
                        inputProps={{ tabIndex: -1 }}
                        readOnly
                        endAdornment={
                            <InputAdornment position="end">
                                {!location.state.disguise && (
                                    <IconButton
                                        size="small"
                                        title="Disguise as another file"
                                        aria-label="Disguise as another file"
                                        onClick={handleUploadDisguiseClick}
                                    >
                                        {/* TODO: Try to find a more appropriate icon */}
                                        <AutoFixHighIcon fontSize="small" />
                                    </IconButton>
                                )}
                                <IconButton
                                    size="small"
                                    title="Change the file"
                                    aria-label="Change file"
                                    onClick={handleUploadFileClick}
                                >
                                    <CachedIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    {location.state.disguise && (
                        <div className="secure__inputs-disguise">
                            <div className="secure__inputs-disguise-title">Disguise as</div>
                            <Input
                                className="secure__inputs-disguise-input"
                                value={location.state.disguise.name}
                                title={location.state.disguise.name}
                                inputProps={{ tabIndex: -1 }}
                                readOnly
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            title="Change the disguise"
                                            aria-label="Change the disguise"
                                            onClick={handleUploadDisguiseClick}
                                        >
                                            <CachedIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            title="Remove the disguise"
                                            aria-label="Remove the disguise"
                                            onClick={handleRemoveDisguiseClick}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </div>
                    )}
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
                                    aria-label={
                                        passwordIsVisible ? 'Hide password' : 'Show password'
                                    }
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
                <div className="secure__agreement">
                    <span>By continuing, you agree to </span>
                    {/* Avoid word wrap on narrow screens */}
                    <Link
                        className="secure__agreement-link"
                        component={'button'}
                        onClick={handleClickAgreement}
                    >
                        the license terms
                    </Link>
                    <span>.</span>
                </div>
                {/* TODO: Add hints for empty password or key */}
                <div className="secure__actions">
                    <Button variant="contained" disabled={!password} onClick={handleEncryptClick}>
                        Encrypt
                    </Button>
                    {!location.state.disguise && (
                        <Button
                            variant="outlined"
                            disabled={!password}
                            onClick={handleDecryptClick}
                        >
                            Decrypt
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
};

function validatePassword(password: string | null): ValidationResult {
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

function validateBlob(action: Action, blob: Blob): ValidationResult {
    if (action === 'encrypt' && blob.size > MAX_FILES_SIZE_MB * 1024 * 1024) {
        return `The encrypted file size exceeds the maximum allowed size of ${MAX_FILES_SIZE_MB}MB.`;
    }

    return true;
}

Secure.displayName = 'Secure';

export default Secure;

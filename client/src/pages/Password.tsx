import { memo, useCallback, useState, useContext, ChangeEvent, MouseEvent } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { lib } from 'crypto-js';
import { useSnackbar } from 'components/Snackbar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import CachedIcon from '@mui/icons-material/Cached';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import {
    MIN_PASSWORD_LENGTH,
    MAX_PASSWORD_LENGTH,
    MAX_ALERT_FILENAME_LENGTH,
    KEY_EXTENSION,
} from 'utils/constants';
import { download, ellipse, generateRandomString, upload, validateFile, wait } from 'utils/common';
import { WindowManagerContext } from 'utils/contexts';
import { crypt, generateSecretKey, parseSecretKey } from 'utils/crypto';
import Loading from 'windows/Loading';
import LicenseAgreement from 'windows/LicenseAgreement';

// TODO Move to interfaces file
interface ISecretKey {
    key: lib.WordArray;
    name: string;
}

// TODO Rename (it's not only the password anymore)
const Password = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const windowContext = useContext(WindowManagerContext);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [passwordIsVisible, setPasswordIsVisible] = useState<boolean>(false);
    const [secretKey, setSecretKey] = useState<ISecretKey | null>(null);

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
                            <b>{ellipse(file.name, MAX_ALERT_FILENAME_LENGTH)}</b> isn&apos;t
                            uploaded. {validation}
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

    const handleOpenSecretKeyMenu = useCallback((event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleRemoveSecretKey = useCallback(() => {
        setSecretKey(null);
    }, []);

    const handleCreateSecretKey = useCallback(() => {
        const key = generateSecretKey();
        const name = generateRandomString(8) + KEY_EXTENSION;
        setSecretKey({
            key,
            name,
        });
        download(new Blob([key.toString()]), name);
        enqueueSnackbar({
            title: 'The secret key is generated',
            message: (
                <>
                    <b>{ellipse(name, MAX_ALERT_FILENAME_LENGTH)}</b> is downloaded to your device
                    and ready to use.
                </>
            ),
        });
    }, []);

    // TODO Add validation here
    const handleUploadSecretKey = useCallback(async () => {
        try {
            const file = await upload(KEY_EXTENSION);
            setSecretKey({
                key: await parseSecretKey(file),
                name: file.name,
            });
        } catch (error) {
            enqueueSnackbar({
                variant: 'error',
                title: 'Failed to upload file',
                message: 'Something went wrong. Please try again.',
            });
            console.error(error);
        }
    }, []);

    const handleCloseSecretKeyMenu = () => {
        setAnchorEl(null);
    };

    const handleClickAgreement = useCallback(() => {
        windowContext.open(<LicenseAgreement />);
    }, []);

    const handleCrypt = useCallback(
        async (action: 'encrypt' | 'decrypt') => {
            const validation = secretKey ? validateKey(secretKey.key) : validatePassword(password);
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
                    crypt(action, file, secretKey?.key || password!),
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
        [location.state, navigate, password, secretKey]
    );

    const handleEncryptClick = useCallback(() => handleCrypt('encrypt'), [handleCrypt]);

    const handleDecryptClick = useCallback(() => handleCrypt('decrypt'), [handleCrypt]);

    if (!location.state) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="password">
            {/* FIXME Fix input focus color */}
            <div className="password__inputs">
                {/* TODO Add ellipsis */}
                <Input
                    value={location.state.file.name}
                    title={location.state.file.name}
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
                    type={secretKey || passwordIsVisible ? 'text' : 'password'}
                    placeholder={secretKey ? undefined : 'Enter the password'}
                    value={secretKey?.name || password}
                    readOnly={!!secretKey}
                    endAdornment={
                        <InputAdornment position="end">
                            {!secretKey && (
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
                            )}
                            <IconButton
                                size="small"
                                title={secretKey ? 'Change the secret key' : 'Add secret key'}
                                onClick={handleOpenSecretKeyMenu}
                            >
                                {secretKey ? (
                                    <VerifiedUserIcon fontSize="small" />
                                ) : (
                                    <AddModeratorIcon fontSize="small" />
                                )}
                            </IconButton>
                        </InputAdornment>
                    }
                    onChange={handlePasswordChanged}
                />
            </div>
            <div className="password__agreement">
                <span>By continuing, you agree to </span>
                <Link onClick={handleClickAgreement}>the license terms and conditions</Link>
                <span>.</span>
            </div>
            {/* TODO Add hints for empty password or key */}
            <div className="password__actions">
                <Button
                    variant="contained"
                    disabled={!password && !secretKey}
                    onClick={handleEncryptClick}
                >
                    Encrypt
                </Button>
                <Button
                    variant="outlined"
                    disabled={!password && !secretKey}
                    onClick={handleDecryptClick}
                >
                    Decrypt
                </Button>
            </div>
            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleCloseSecretKeyMenu}
                onClick={handleCloseSecretKeyMenu}
            >
                {/* TODO Add short description and popup tip */}
                {/* FIXME This item appears immideately after adding of the secret key */}
                {secretKey && (
                    <MenuItem divider onClick={handleRemoveSecretKey}>
                        <ListItemIcon>
                            <ClearIcon fontSize="small" />
                        </ListItemIcon>
                        Remove the key
                    </MenuItem>
                )}
                <MenuItem divider onClick={handleCreateSecretKey}>
                    <ListItemIcon>
                        <AddIcon fontSize="small" />
                    </ListItemIcon>
                    Create new secret key
                </MenuItem>
                <MenuItem onClick={handleUploadSecretKey}>
                    <ListItemIcon>
                        <UploadIcon fontSize="small" />
                    </ListItemIcon>
                    Upload another one
                </MenuItem>
            </Menu>
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

function validateKey(key: lib.WordArray): true | string {
    // FXIME Add key validation
    return true;
}

Password.displayName = 'Password';

export default memo(Password);

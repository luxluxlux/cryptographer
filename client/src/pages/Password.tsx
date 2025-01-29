import { memo, useCallback, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { lib } from 'crypto-js';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import CachedIcon from '@mui/icons-material/Cached';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from 'utils/constants';
import { download, upload } from 'utils/common';
import { WindowManagerContext } from 'utils/windows';
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

    const windowContext = useContext(WindowManagerContext);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [secretKey, setSecretKey] = useState<ISecretKey | null>(null);

    const handleFileClick = useCallback(async () => {
        try {
            const file = await upload();
            navigate('/password', { state: { file } });
        } catch (error) {
            console.error(error);
            // TODO Show a messagebox (maybe create an error logger)
        }
    }, []);

    const handlePasswordChanged = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }, []);

    const handleOpenSecretKeyMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleRemoveSecretKey = useCallback(() => {
        setSecretKey(null);
    }, []);

    const handleCreateSecretKey = useCallback(() => {
        const key = generateSecretKey();
        const name = 'secret_key.dat';
        setSecretKey({
            key,
            name,
        });
        download(new Blob([key.toString()]), name);
    }, []);

    const handleUploadSecretKey = useCallback(async () => {
        try {
            const file = await upload();
            setSecretKey({
                key: await parseSecretKey(file),
                name: file.name,
            });
        } catch (error) {
            console.error(error);
            // TODO Show a messagebox (maybe create an error logger)
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
                alert(validation);
                return;
            }

            windowContext.open(<Loading title="File processing, please wait..." />, true, false);
            const file = location.state.file;
            try {
                const data = await crypt(action, file, secretKey?.key || password!);
                navigate('/success', {
                    state: {
                        data: new Blob([data], { type: file.type }),
                        fileName: file.name,
                        action,
                    },
                });
            } catch (error) {
                console.error(error);
                navigate('/failure', { state: { fileName: file.name, action } });
            } finally {
                windowContext.close();
            }
        },
        [location.state.file, navigate, password, secretKey]
    );

    const handleEncryptClick = useCallback(() => handleCrypt('encrypt'), [handleCrypt]);

    const handleDecryptClick = useCallback(() => handleCrypt('decrypt'), [handleCrypt]);

    return (
        <div className="password">
            {/* FIXME Fix input focus color */}
            <div className="password__inputs">
                <Input
                    value={location.state.file.name}
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
                {/* TODO Add eye button to the endAdornment */}
                <Input
                    type={secretKey ? undefined : 'password'}
                    placeholder={secretKey ? undefined : 'Enter the password'}
                    value={secretKey ? secretKey.name : password}
                    readOnly={!!secretKey}
                    endAdornment={
                        <InputAdornment position="end">
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
            <div className="password__agreement-label">
                <span>By continuing, you agree to </span>
                <Button className="password__agreement-label-button" onClick={handleClickAgreement}>
                    the license terms and conditions
                </Button>
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
                    <MenuItem onClick={handleRemoveSecretKey}>
                        <ListItemIcon>
                            <ClearIcon fontSize="small" />
                        </ListItemIcon>
                        Remove the key
                    </MenuItem>
                )}
                <MenuItem onClick={handleCreateSecretKey}>
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
        return 'The password is empty';
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
        return `Password must contain at least ${MIN_PASSWORD_LENGTH} characters`;
    }

    if (password.length > MAX_PASSWORD_LENGTH) {
        return `Password must contain no more than ${MAX_PASSWORD_LENGTH} characters`;
    }

    return true;
}

function validateKey(key: lib.WordArray): true | string {
    // FXIME Add key validation
    return true;
}

Password.displayName = 'Password';

export default memo(Password);

import { memo, useCallback, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { lib } from 'crypto-js';
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from 'utils/constants';
import { download, upload } from 'utils/common';
import { crypt, generateSecretKey, parseSecretKey } from 'utils/crypto';
import Button from 'components/Button';
import Input from 'components/Input';
import createImg from 'resources/create.svg';
import uploadImg from 'resources/upload.svg';

const Password = memo(() => {
    const inputRef = useRef<HTMLInputElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    const [secretKey, setSecretKey] = useState<lib.WordArray>();
    const [loading, setLoading] = useState(false);

    const handleGetSecretKeyClick = useCallback(() => {
        const data = generateSecretKey();
        setSecretKey(data);
        download(new Blob([data.toString()]), 'secret_key.dat');
    }, []);

    const handleAddSecretKeyClick = useCallback(async () => {
        try {
            const file = await upload();
            setSecretKey(await parseSecretKey(file));
        } catch (error) {
            console.error(error);
            // TODO Show a messagebox (maybe create an error logger)
        }
    }, []);

    const handleCryptClick = useCallback(async (action: 'encrypt' | 'decrypt') => {
        const password = inputRef.current?.value;

        const validation = validatePassword(password);
        if (validation !== true) {
            alert(validation);
            return;
        }

        setLoading(true);
        const file = location.state.file;
        try {
            const data = await crypt(action, file, secretKey || password as string);
            navigate('/success', {
                state: {
                    data: new Blob([data], { type: file.type }),
                    fileName: file.name,
                    action
                }
            });
        } catch (error) {
            console.error(error);
            navigate('/failure', { state: { fileName: file.name, action } });
        } finally {
            setLoading(false);
        }
    }, [location.state.file, navigate, secretKey]);

    return (
        <div className={clsx("password", loading && 'password__loading')}>
            <Input ref={inputRef} defaultValue={location.state.file.name} readOnly={true} />
            <div className="password__keys">
                <Input ref={inputRef} type='password' maxLength={MAX_PASSWORD_LENGTH} placeholder='Enter the password' />
                {/* TODO Support adaptive version */}
                <Button onClick={() => handleGetSecretKeyClick()} icon={createImg} title="Create secret key" />
                <Button onClick={() => handleAddSecretKeyClick()} icon={uploadImg} title="Upload secret key" />
            </div>
            {secretKey && <div className='password__message'>The secret key successfully loaded</div>}
            <div className='password__actions'>
                <Button onClick={() => handleCryptClick('encrypt')}>Encrypt</Button>
                <Button onClick={() => handleCryptClick('decrypt')} style="secondary">Decrypt</Button>
            </div>
        </div>
    );
});

function validatePassword(password?: string): true | string {
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

export default Password;
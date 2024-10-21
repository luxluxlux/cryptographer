import { memo, useCallback, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from 'utils/constants';
import { crypt } from 'utils/crypto';
import Button from 'components/Button';
import Input from 'components/Input';

const Password = memo(() => {
    const inputRef = useRef<HTMLInputElement>(null);

    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleClick = useCallback(async (action: 'encrypt' | 'decrypt') => {
        const password = inputRef.current?.value;

        const validation = validatePassword(password);
        if (validation !== true) {
            alert(validation);
            return;
        }

        setLoading(true);
        const file = location.state.file;
        try {
            const data = await crypt(file, password as string, action);
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
    }, [location, navigate]);

    return (
        <div className={clsx("password", loading && 'password__loading')}>
            {/* FIXME Value forwarding without onChange */}
            {/* TODO Add update file button */}
            <Input ref={inputRef} value={location.state.file.name} />
            <Input ref={inputRef} type='password' maxLength={MAX_PASSWORD_LENGTH} placeholder='Enter the password' />
            <div className='password__actions'>
                <Button onClick={() => handleClick('encrypt')}>Encrypt</Button>
                <Button onClick={() => handleClick('decrypt')} style="secondary">Decrypt</Button>
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
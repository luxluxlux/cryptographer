import { memo, useCallback, createRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from 'components/Button';
import Input from 'components/Input';

const Password = memo(() => {
    const inputRef = createRef<HTMLInputElement>();

    const location = useLocation();

    const navigate = useNavigate();

    const handleClick = useCallback((action: 'encrypt' | 'decrypt') => {
        // TODO Escape the password
        const password = inputRef.current?.value;

        if (!password) {
            alert('The password is empty');
            return;
        }

        const file = location.state.file
        const formData = new FormData();
        formData.append("file", location.state.file);
        formData.append("password", password);
        formData.append("action", action);

        // TODO Maybe use Axios
        fetch("/crypt", { method: "POST", body: formData })
            .then(
                (result) => {
                    result.blob().then(data => {
                        navigate('/success', { state: { data, fileName: file.name, action } });
                    });
                },
                (error) => {
                    console.error(error);
                    navigate('/failure', { state: { fileName: file.name, action } });
                }
            );
    }, []);

    return (
        <div className="password">
            <p><b>{location.state.file.name}</b> is loaded.</p>
            <Input ref={inputRef} type='password' placeholder='Enter the password' />
            <div className='password__actions'>
                <Button onClick={() => handleClick('encrypt')}>Encrypt</Button>
                <Button onClick={() => handleClick('decrypt')} color="secondary">Decrypt</Button>
            </div>
        </div>
    );
});

export default Password;
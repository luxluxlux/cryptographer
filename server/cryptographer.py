import os
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from .constants import TEMP_DIR


class Cryptographer:
    def __init__(self):
        self.__salt = self.__get_salt()

    def encrypt(self, file, password):
        kdf = self.__get_kdf()
        key = base64.urlsafe_b64encode(kdf.derive(bytes(password, 'UTF-8')))
        f = Fernet(key)
        data = file.read()
        return f.encrypt(data)

    def decrypt(self, file, password):
        kdf = self.__get_kdf()
        key = base64.urlsafe_b64encode(kdf.derive(bytes(password, 'UTF-8')))
        f = Fernet(key)
        data = file.read()
        return f.decrypt(data)

    # It should always be unique
    def __get_kdf(self):
        # TODO Get from the configuration
        return PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=self.__salt,
            iterations=480000
        )

    def __get_salt(self):
        path = os.path.join(os.path.dirname(__file__), TEMP_DIR, 'salt.bin')
        if os.path.exists(path):
            with open(path, 'rb') as file:
                return file.read()

        # Generate a new salt if the file is missing
        salt = os.urandom(32)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'wb') as file:
            file.write(salt)
        return salt

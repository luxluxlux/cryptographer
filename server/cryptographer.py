import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC


class Cryptographer:
    def __init__(self):
        # TODO Get from a safety place (eviroment variable or file)
        self.__salt = b'Z\x1c$\xbc\xf9\x05G\xf2\xc8\xe7xg\xa5\x9c\xbf\x82'

    @property
    def __kdf(self):
        return PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=self.__salt,
            iterations=480000,
        )

    def encrypt(self, file, password):
        kdf = self.__kdf
        key = base64.urlsafe_b64encode(kdf.derive(bytes(password, 'UTF-8')))
        f = Fernet(key)
        data = file.read()
        return f.encrypt(data)

    def decrypt(self, file, password):
        kdf = self.__kdf
        key = base64.urlsafe_b64encode(kdf.derive(bytes(password, 'UTF-8')))
        f = Fernet(key)
        data = file.read()
        return f.decrypt(data)

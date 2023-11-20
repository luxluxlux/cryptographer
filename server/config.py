import os
from configparser import ConfigParser
from .constants import TEMP_DIR

# Default configuration
DEFAULT = {
    'Limits': {
        'MaxContentSize': 10485760,
        'MaxConnectionsNumberPerMinute': 10,
        'MaxConnectionsNumberPerHour': 50,
        'MaxConnectionsNumberPerDay': 100
    }
}


class Config:
    def __init__(self):
        self.__config = ConfigParser()
        # Don't make capital keys lower case
        # https://stackoverflow.com/questions/19359556/configparser-reads-capital-keys-and-make-them-lower-case
        self.__config.optionxform = str
        path = os.path.join(os.path.dirname(__file__), TEMP_DIR, 'config.ini')
        if os.path.exists(path):
            with open(path, 'r') as file:
                self.__config.read(path)

        # Write default configuration if it doesn't exists
        os.makedirs(os.path.dirname(path), exist_ok=True)
        self.__config.read_dict(DEFAULT)
        with open(path, 'w') as file:
            self.__config.write(file)

    def read(self, section, key, type):
        return type(self.__config[section][key])

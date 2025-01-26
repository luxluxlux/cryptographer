# Cryptographer

<!-- https://github.com/inttter/md-badges -->
![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)
![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-C69?logo=sass&logoColor=fff)
![Flask](https://img.shields.io/badge/Flask-000?logo=flask&logoColor=fff)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)

Online file encryptor. Designed to encrypt and decrypt files for transmission over unsecured channels, for example, through the the Internet. This is an open source project on a non-commercial basis, designed to protect personal data from intruders. The owner of the application is not responsible for the possible consequences of using the current product for purposes prohibited by the laws of various countries.

## How it works?

We use symmetric encryption and hope that the transfer of the key (password) occurs over a secure communication channel, for example, live, or does not occur at all, for example, when the file is encrypted and decrypted by the same person.
We do not store customer data or encryption keys. The final result of the calculation is written to a file received by the client, which can only be decrypted in the same application with the same configuration.

## Is it reliable?

Actually, any cipher can be cracked, but we encode the data in such a way that today's personal computer power is not enough to decrypt the encrypted file. At the same time, we don't process or store any information uploaded by the user, as all calculations are done on the client side.

## Documentation

- [Figma layouts](https://www.figma.com/proto/vJngV2H7MrnI0pt3XD4Bos/Cryptographer?t=iBSnFTpCMg47VyAc-0&scaling=contain&content-scaling=fixed&page-id=0%3A1&node-id=1140-161)

## Launch

### Python interpreter

Installation requirements:
- Python
- Node.js

Go to the project directory.

Install Python dependencies:

```
pip install -r server/requirements.txt
```

Install npm dependencies:

```
npm i --prefix client
```

Build client files:

```
npm run --prefix client build
```

Run the application:

```
python main.py
```

### Docker container

Installation requirements:
- Ubuntu server
- Nginx web server

Go to the project directory and execute in the console:

```
sudo bash start.sh
```
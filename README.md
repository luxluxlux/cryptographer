# Cryptographer

Online file encryptor. Designed to encrypt and decrypt files for transmission over unsecured channels, for example, through the the Internet.

This is an open source project on a non-commercial basis, designed to protect personal data from intruders. The owner of the application is not responsible for the possible consequences of using the current product for purposes prohibited by the laws of various countries.

## How it works?

We use symmetric encryption and hope that the transfer of the key (password) occurs over a secure communication channel, for example, live, or does not occur at all, for example, when the file is encrypted and decrypted by the same person.
We do not store customer data or encryption keys. The final result of the calculation is written to a file received by the client, which can only be decrypted in the same application with the same configuration.

## Is it reliable?

Actually, any cipher can be cracked, but we encode the data in such a way that today's computer power is not enough to decrypt the encrypted file. At the same time, we do not enlarge the file so much that you experience problems with storing it. The specific configuration of the running application is stored (generated) on the server and is known only to its administrator.

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
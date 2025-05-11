# Cryptographer

<!-- https://github.com/inttter/md-badges -->
![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)
![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-C69?logo=sass&logoColor=fff)
![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=fff)
![Flask](https://img.shields.io/badge/Flask-000?logo=flask&logoColor=fff)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)

**Cryptographer** is a free, open source web application for encrypting and decrypting files directly in your browser. It’s designed to securely transmit files over unprotected channels - such as the Internet - by ensuring that the file contents remain private and inaccessible without a password.

This is a non-commercial project focused on helping individuals protect their personal data from unauthorized access. The developers are not responsible for any misuse of the application in ways that violate the laws of any country.

##  Key Features

| Feature | Description |
|---------|-------------|
| 🛡️ **Password protection** | Protect any file with a strong password. Only those who know the password can access the content. |
| 🌐 **No installation** | Runs entirely in your browser. No need to install any software or extensions. |
| 🙈 **No registration** | Use the tool without creating an account or submitting any personal information. |
| 💸 **Completely free** | 100% free to use — no hidden fees, no subscriptions, and no limitations. |
| 🧩 **Open source** | Transparent and community-driven. View, audit, or contribute to the code on GitHub. |
| 🖥️ **Local encryption** | All encryption and decryption are done locally in your browser. Your files stay on your device. |

## How does it work?

Cryptographer uses **symmetric encryption** to secure your files. This means that the same password is required to both encrypt and decrypt the file. We assume the password is either:

* Transferred securely (e.g., in person or via encrypted messenger), or
* Not transferred at all (e.g., the user encrypts and decrypts their own files).

All data processing occurs **entirely in the browser**. No encryption keys, passwords, or file contents are sent to or stored on any server. The encrypted output is provided as a downloadable file that can only be decrypted using Cryptographer.

## Is it secure?

Cryptographer uses modern, well-vetted cryptographic standards (such as **AES**, **PBKDF2**, and **SHA-512**) to encode your data. Given current and near-future computing power, decrypting a file without the correct password is practically infeasible.

Security also depends on how well the password is protected and how secure the user's device is. Since everything happens locally, the safety of the encrypted data relies entirely on the user's environment.

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
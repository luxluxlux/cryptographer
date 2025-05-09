import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import { APPLICATION_NAME, GITHUB_URL } from 'utils/constants';

const HowItWorks = () => (
    <div>
        <h2>How does it work?</h2>
        <p>
            You choose a file from your device and set a password. That password is used to generate
            a cryptographic key, which encrypts the file directly in your browser - no data is ever
            sent to a server.
        </p>
        <p>
            The encrypted file can then be safely shared via email, social networks, or stored on a
            disk or removable media. Its contents remain inaccessible until it&apos;s decrypted in
            the Cryptographer app using the same password.
        </p>
        <p>
            <Alert variant="outlined" severity="warning">
                <strong>Do not modify or compress encrypted files before sharing!</strong>
                <p></p>Any change, even minor, can corrupt the file and make it impossible to
                decrypt or recover the original data.
            </Alert>
        </p>
        <h2>Can you trust {APPLICATION_NAME}?</h2>
        <p>Yes, and here&apos;s why:</p>
        <h3>✅ We never see your secrets</h3>
        <p>
            <strong>We don&apos;t collect or store</strong> your passwords, encryption keys, file
            contents, or any other sensitive information.{' '}
            <strong>All encryption and decryption happens entirely in your browser</strong> - your
            data is never sent to our servers.
        </p>
        <h3>🧪 You can verify this yourself</h3>
        <p>Want to be sure? Here&apos;s how to check using your browser:</p>
        <ol>
            <li>Open Developer Tools (F12).</li>
            <li>
                Go to the <strong>Network tab.</strong>
            </li>
            <li>Watch the requests as you use the app.</li>
            <li>
                You&apos;ll see that no passwords, encryption keys, or file contents are transmitted
                - only basic service data (like page requests).
            </li>
        </ol>
        <h3>🔍 We avoid insecure storage</h3>
        <p>
            We don&apos;t store any sensitive information in cookies, localStorage, or
            sessionStorage - because those can be exposed or misused by third parties.
        </p>
        <p>To check:</p>
        <ol>
            <li>Open Developer Tools (F12).</li>
            <li>
                Go to the <strong>Application tab.</strong>
            </li>
            <li>
                Check under Storage &gt; <strong>Cookies / Local Storage / Session Storage</strong>.
            </li>
            <li>You&apos;ll see - nothing sensitive is stored.</li>
        </ol>
        <h3>🧩 Open source = Full transparency</h3>
        <p>
            Cryptographer is 100% open source. You can inspect{' '}
            <Link href={GITHUB_URL} target="_blank" rel="noopener">
                the full source code on GitHub
            </Link>{' '}
            and confirm for yourself that we follow everything stated above.
        </p>
        <h2>How reliable is it?</h2>
        <p>
            We encrypt your data using strong, modern cryptographic standards such as{' '}
            <strong>AES</strong>, <strong>PBKDF2</strong>, and <strong>SHA-512</strong>, making it
            virtually impossible for attackers to read, modify, or decrypt your files with current
            or near-future computing power.
        </p>
        <p>
            Since all encryption is performed locally in your browser, the security of your
            encrypted files depends on the safety of your device - including how well it&apos;s
            protected from malware, unauthorized access, or data leaks.
        </p>
        <p>
            <Alert variant="outlined" severity="warning">
                This service is designed to protect your <strong>personal data</strong> - such as
                photos, videos, audio files, text documents, and more. It is{' '}
                <strong>not intended for encrypting sensitive materials</strong> involving{' '}
                <strong>state, industrial, or commercial secrets</strong>, where stricter security
                and compliance standards may be required.
            </Alert>
        </p>
        <p>
            <Alert variant="outlined" severity="error">
                <strong>
                    The use of this product for illegal purposes is strictly prohibited!
                </strong>
                <p>
                    The authors of this service only provide tools for encrypting data in the
                    browser. We do not have access to the downloaded files and{' '}
                    <strong>are not responsible for their content</strong>.
                </p>
                <p>
                    Be aware that government agencies of any country have the necessary expertise,
                    technical capabilities, and computing power to potentially access any encrypted
                    data.
                </p>
            </Alert>
        </p>
    </div>
);

HowItWorks.displayName = 'HowItWorks';

export default HowItWorks;

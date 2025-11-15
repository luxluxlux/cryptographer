import { Helmet } from 'react-helmet-async';
import Link from '@mui/material/Link';
import { APPLICATION_NAME, GITHUB_URL } from 'utils/constants';
import { WINDOW_DATA, WINDOW } from 'components/WindowManager';
import { Header } from 'components/Page';

/**
 * The license agreement for the use of the application.
 * @return Page content.
 */
const LicenseAgreement = () => (
    <>
        <Helmet>
            <title>{APPLICATION_NAME} | License Agreement</title>
        </Helmet>
        <Header
            path={`?popup=${WINDOW_DATA[WINDOW.LICENSE_AGREEMENT].path}`}
            metaTitle={`${APPLICATION_NAME} License Agreement — Terms of Use and Privacy Policy`}
            metaDescription={`Read the ${APPLICATION_NAME} license agreement to understand your rights and responsibilities when using this open-source file encryption tool. Learn about privacy, data security, permitted use, and legal compliance.`}
            metaKeywords={`license agreement, ${APPLICATION_NAME}, terms of use, privacy policy, user agreement, legal notice, disclaimer, open source, data privacy, password protection, file encryption, file disguise`}
            ogTitle={`${APPLICATION_NAME} — License Agreement`}
            ogDescription="Read the license agreement to understand your rights and responsibilities when using this open-source file encryption tool. Learn about privacy, data security, permitted use, and legal compliance."
        />
        <div>
            <h2>License agreement</h2>

            <h3>1. Introduction</h3>
            <p>
                This <strong>{APPLICATION_NAME} license agreement</strong> (the
                &quot;Agreement&quot;) governs your use of the <strong>{APPLICATION_NAME}</strong>{' '}
                application (the &quot;Product&quot;), which is an open-source, non-commercial tool
                designed to provide an easy and secure way to encrypt files with a password. The
                primary goal of {APPLICATION_NAME} is to make file encryption as accessible, safe,
                and simple as possible.
            </p>
            <p>
                By using this product, you agree to be bound by the terms and conditions outlined in
                this Agreement.
            </p>

            <h3>2. Ownership and license</h3>
            <p>
                {APPLICATION_NAME} is an <strong>open-source project</strong> that is developed and
                maintained by individual enthusiasts. The project is not affiliated with any company
                or organization. You are granted a <strong>free</strong> license to use the Product
                for personal, non-commercial purposes. This Product is provided to you{' '}
                <strong>at no charge</strong>, and it does not include any paid services or
                subscriptions.
            </p>
            <p>
                {APPLICATION_NAME} is licensed under an open-source license, which allows you to
                use, modify, and distribute the code as long as you comply with the terms of the
                license. For full license details, refer to the license file within the{' '}
                <Link href={GITHUB_URL} target="_blank" rel="noopener">
                    source code
                </Link>
                .
            </p>

            <h3>3. Data processing and privacy</h3>
            <p>
                The Product is designed with <strong>privacy and security</strong> in mind. All data
                processing occurs <strong>exclusively on the client side</strong>, meaning that no
                confidential information (such as passwords, encryption keys, or file contents) is
                sent to or stored on the server.
            </p>
            <p>
                The server only exchanges <strong>service-related data</strong>, such as page
                requests and other necessary data for proper functioning of the website.{' '}
                <strong>No sensitive data</strong> such as encryption keys, passwords, or the
                contents of your files are stored or processed on our server.
            </p>

            <h3>4. File sharing and security</h3>
            <ul>
                <li>
                    <strong>File sharing</strong>: You are free to share the encrypted files through
                    email, messaging services, social media, or store them on both removable and
                    non-removable media. Encrypted files can be safely shared without compromising
                    their contents as long as the password remains secure.
                </li>
                <li>
                    <strong>Password security</strong>: You acknowledge and understand that in order
                    to ensure the safety of encrypted files, the password used to encrypt the files
                    should be <strong>kept secret</strong> and shared only through secure channels.{' '}
                    <strong>Never share your password through insecure methods</strong> (e.g.,
                    unencrypted messages or insecure platforms).
                </li>
                <li>
                    <strong>File integrity</strong>: You are informed that{' '}
                    <strong>modifying or changing the file</strong> after encryption, such as
                    compressing (except for archiving) or altering its contents, can result in{' '}
                    <strong>irreversible data loss</strong> and make it impossible to decrypt the
                    file.
                </li>
            </ul>

            <h3>5. Use case restrictions</h3>
            <ul>
                <li>
                    {APPLICATION_NAME} is specifically designed for encrypting personal data, such
                    as <strong>photos, videos, audio files, text documents, etc.</strong> It is{' '}
                    <strong>not intended</strong> for encrypting documents containing{' '}
                    <strong>government, industrial, commercial</strong>, or other types of sensitive
                    or classified information.
                </li>
                <li>
                    <strong>Illegal use</strong>: You are strictly prohibited from using this tool
                    for any illegal activities. Any use of {APPLICATION_NAME} for unlawful purposes
                    may result in legal consequences. Please note that{' '}
                    <strong>government agencies</strong> have the <strong>technical means</strong>{' '}
                    and <strong>computational power</strong> to handle encrypted information if
                    necessary, and they can decrypt information, regardless of the encryption method
                    used.
                </li>
            </ul>

            <h3>6. No encryption or decryption services</h3>
            <p>
                The authors of this project do not offer any{' '}
                <strong>encryption or decryption services</strong>. Instead, {APPLICATION_NAME} is a{' '}
                <strong>self-service tool</strong> that allows users to encrypt and decrypt files
                independently. Users are solely responsible for their actions when using this tool.
            </p>

            <h3>7. Security and responsibility</h3>
            <ul>
                <li>
                    <strong>Encryption security</strong>: The authors of {APPLICATION_NAME} cannot
                    be held responsible for any potential data breaches or unauthorized access to
                    files. The security of encrypted files relies directly on the{' '}
                    <strong>security of the user&apos;s device</strong> (including protection from
                    malware, unauthorized access, or other security vulnerabilities) and the{' '}
                    <strong>password integrity</strong>.
                </li>
                <li>
                    <strong>No file decryption guarantee</strong>: The authors of the project do not
                    guarantee that a file will be successfully decrypted if it has been modified,
                    compressed (other than archived), damaged, or encrypted by a different
                    application.
                </li>
                <li>
                    <strong>File content</strong>: The authors are not responsible for the content
                    of the files you encrypt or decrypt, nor for how they are used afterward. You
                    are solely responsible for ensuring the legality and appropriateness of the
                    files you process.
                </li>
            </ul>

            <h3>8. Limitation of liability</h3>
            <p>
                By using {APPLICATION_NAME}, you agree that the authors will not be held responsible
                for any damages, data loss, or any issues resulting from the use or inability to use
                the Product. You are solely responsible for safeguarding your encrypted files and
                ensuring that you use appropriate security measures for your passwords and devices.
            </p>

            <h3>9. Legal compliance</h3>
            <p>
                The Product is intended to be used in compliance with all applicable laws and
                regulations. If you are unsure about the legality of encrypting certain types of
                files or using {APPLICATION_NAME} in your jurisdiction, it is your responsibility to
                seek legal advice.
            </p>

            <h3>10. Modifications and updates</h3>
            <p>
                As an open-source project, {APPLICATION_NAME} may be updated or modified by its
                contributors. We are continuously working to improve the product and its features.
                Users will be notified of updates via the official{' '}
                <Link href={GITHUB_URL} target="_blank" rel="noopener">
                    GitHub repository
                </Link>
                .
            </p>

            <h3>11. Contact</h3>
            <p>
                If you have any questions or concerns about this Agreement or the Product, please
                contact the author via the official{' '}
                <Link href={GITHUB_URL} target="_blank" rel="noopener">
                    project page on GitHub
                </Link>
                .
            </p>
            <p>
                <strong>
                    By using {APPLICATION_NAME}, you acknowledge that you have read, understood, and
                    agree to the terms and conditions of this license agreement.
                </strong>
            </p>
        </div>
    </>
);

LicenseAgreement.displayName = 'LicenseAgreement';

export default LicenseAgreement;

import { Helmet } from 'react-helmet-async';
import Link from '@mui/material/Link';
import { APPLICATION_NAME, GITHUB_URL, MAX_FILES_SIZE_MB } from 'utils/constants';
import { WINDOW_DATA, WINDOW } from 'components/WindowManager';
import { Header } from 'components/Page';

const FAQ = () => (
    <>
        <Helmet>
            <title>{APPLICATION_NAME} | FAQ</title>
        </Helmet>
        <Header
            path={`?popup=${WINDOW_DATA[WINDOW.FAQ].path}`}
            metaTitle={`${APPLICATION_NAME} FAQ — File Encryption, Password Protection, and Troubleshooting`}
            metaDescription={`Find answers to common questions about ${APPLICATION_NAME} — a free, open source web app to encrypt, decrypt, and disguise a file with a password directly in your browser. Learn about supported formats, file size limits, and how to contribute.`}
            metaKeywords={`faq, ${APPLICATION_NAME}, help, support, questions, free, is safe, encrypt file, decrypt file, disguise file, file password, file security, bug report, data privacy, partnership`}
            ogTitle={`${APPLICATION_NAME} — Frequently asked questions (FAQ)`}
            ogDescription="Find answers to common questions about the project. Learn about supported formats, file size limits, and how to contribute."
        />
        <div>
            <h2>Frequently asked questions (FAQ)</h2>
            <h3>💰 How much does it cost?</h3>
            <p>
                It&apos;s <strong>100% free</strong>! There are no hidden fees, no subscriptions,
                and no payments required. Our goal is to make digital security accessible to
                everyone without any barriers.
            </p>
            <h3>🗝️ Where can I decrypt encrypted files?</h3>
            <p>
                You can <strong>only decrypt files here, in this web app</strong>. All encryption
                and decryption processes happen locally in your browser to ensure your data remains
                private. We&apos;re working on offline and mobile versions of the app for even more
                convenience, but now, this web app is the only place where decryption is supported.
            </p>
            <h3>🔓 Can I decrypt files here that were encrypted in another app?</h3>
            <p>
                No. You can only decrypt files that were{' '}
                <strong>previously encrypted using {APPLICATION_NAME}</strong>. This is because it
                uses a custom file structure that is not compatible with other encryption formats.
                We do not intend to support third-party encryption formats, as our focus is on
                maintaining a simple, secure, and consistent experience within this application.
            </p>
            <h3>📦 What is the maximum file size?</h3>
            <p>
                The maximum file size you can encrypt or decrypt is{' '}
                <strong>{MAX_FILES_SIZE_MB}MB</strong>. This ensures that the encryption process is
                quick and efficient while maintaining security. If your file exceeds this size, you
                might need to compress or split it into smaller parts.
            </p>
            <h3>📁 What file types can I use?</h3>
            <p>
                You can use <strong>any file format</strong>, whether it&apos;s a document, image,
                audio, video, or any other type of file. However,{' '}
                <strong>folder uploads are currently not supported</strong>, but we are working on
                it.
            </p>
            <h3>📂 Can I upload multiple files or a whole folder?</h3>
            <p>
                At this time, we do not support uploading multiple files or entire folders for
                encryption. However, as a workaround, you can compress your files into a{' '}
                <strong>ZIP archive</strong> and then encrypt that archive. We&apos;re also working
                on adding native support for multiple file uploads and folders in a future release.
            </p>
            <h3>🎭 Can I disguise an encrypted file as another file type?</h3>
            <p>
                Yes. {APPLICATION_NAME} allows you to disguise an encrypted file as a different file
                type (for example, making a document look like an image). This provides an
                additional layer of privacy and makes sensitive files less noticeable.
            </p>
            <h3>🪄 Is disguising a file reversible? How do I restore it?</h3>
            <p>
                Yes. To reveal the disguised encrypted file, simply import it back into
                {APPLICATION_NAME}. The app automatically detects the hidden encrypted content and
                prompts you for the correct password to decrypt it.
            </p>
            <h3>🚫 I can&apos;t encrypt or decrypt a file. What should I do?</h3>
            <p>
                If you&apos;re having trouble encrypting or decrypting a file, first, ensure that:
            </p>
            <ol>
                <li>The file isn&apos;t corrupted or damaged.</li>
                <li>
                    The password you entered is correct (make sure Caps Lock is off, there are no
                    typos or extra spaces).
                </li>
            </ol>
            <p>
                If the issue persists and you&apos;ve verified that the file and password are
                correct, please file a bug report on{' '}
                <Link href={GITHUB_URL} target="_blank" rel="noopener">
                    our GitHub project page
                </Link>
                . When filing the report, be sure to:
            </p>
            <ul>
                <li>
                    Mention the <strong>file extension</strong> of the encrypted file.
                </li>
                <li>
                    Attach a <strong>screenshot</strong> of the error or issue.
                </li>
                <li>
                    Upload the <strong>developer console output</strong> (Open Developer Tools (F12){' '}
                    {'>'} Go to the Console tab).
                </li>
            </ul>
            <p>
                You don&apos;t need to upload the encrypted file itself, but if you can provide
                another example file that reproduces the issue (without sensitive data), it would
                help us resolve the issue faster.
            </p>
            <h3>🐞 I found a bug in the code or interface</h3>
            <p>
                If you&apos;ve encountered a bug in the code or the user interface, we appreciate
                your help in improving the project! You can either follow the steps mentioned above
                to file a bug report, or if you&apos;re familiar with the code and know how to fix
                the issue, feel free to submit a <strong>pull request</strong> to{' '}
                <Link href={GITHUB_URL} target="_blank" rel="noopener">
                    our repository
                </Link>
                . We welcome contributions!
            </p>
            <h3>🤝 I want to contribute</h3>
            <p>
                We&apos;re thrilled to have passionate individuals like you join the project!
                Whether you&apos;re a developer, designer, security expert, or just someone who
                believes in our mission, we welcome your contributions. You can submit a{' '}
                <strong>pull request</strong> to{' '}
                <Link href={GITHUB_URL} target="_blank" rel="noopener">
                    our GitHub repository
                </Link>{' '}
                or get in touch with the project author through any means that&apos;s convenient for
                you.
            </p>
            <h3>🏢 I represent an organization interested in your product</h3>
            <p>
                Although Cryptographer is an open-source project, we are open to cooperation,
                sponsorship, and other forms of mutually beneficial collaboration. If your
                organization is interested, please visit{' '}
                <Link href={GITHUB_URL} target="_blank" rel="noopener">
                    our project page on GitHub
                </Link>{' '}
                to learn more and find ways to get in touch with the author. We&apos;d be happy to
                hear from you and explore potential opportunities.
            </p>
        </div>
    </>
);

FAQ.displayName = 'FAQ';

export default FAQ;

import { useCallback, useContext, MouseEvent } from 'react';
import Link from '@mui/material/Link';
import { APPLICATION_NAME, GITHUB_URL, VERSION } from 'utils/constants';
import { WindowManagerContext } from 'utils/contexts';
import LicenseAgreement from 'windows/LicenseAgreement';

const About = () => {
    const windowContext = useContext(WindowManagerContext);

    const handleClickAgreement = useCallback((event: MouseEvent<HTMLElement>) => {
        // Prevent window from being closed
        event.stopPropagation();
        windowContext.open(<LicenseAgreement />);
    }, []);

    return (
        <div>
            <h2>About the project</h2>
            <p>
                <strong>{APPLICATION_NAME}</strong> project is an open source solution for fast and
                convenient file protection with a password. Its main goal is to make file encryption
                as accessible, secure and easy to use as possible.
            </p>
            <h3>Key features</h3>
            <div className="about__features">
                <div>
                    🛡️ <strong>Password protection</strong>
                </div>
                <div>
                    Protect any file with a strong password. Only those who know the password can
                    access the content.
                </div>
                <div>
                    🌐 <strong>No installation</strong>
                </div>
                <div>
                    Runs entirely in your browser. No need to install any software or extensions.
                </div>
                <div>
                    🙈 <strong>No registration</strong>
                </div>
                <div>
                    Use the tool without creating an account or submitting any personal information.
                </div>
                <div>
                    💸 <strong>Completely free</strong>
                </div>
                <div>100% free to use - no hidden fees, no subscriptions, and no limitations.</div>
                <div>
                    🧩 <strong>Open source</strong>
                </div>
                <div>
                    Transparent and community-driven. View, audit, or contribute to the code on
                    GitHub.
                </div>
                <div>
                    🖥️ <strong>Local encryption</strong>
                </div>
                <div>
                    All encryption and decryption are done locally in your browser. Your files stay
                    on your device.
                </div>
            </div>
            <h2>Licence agreement</h2>
            <p>
                By using {APPLICATION_NAME}, you acknowledge that you have read, understood, and
                agree to be bound by the terms and conditions outlined in this{' '}
                <Link
                    className="password__agreement-link"
                    component={'button'}
                    onClick={handleClickAgreement}
                >
                    license agreement
                </Link>
                . This includes, but is not limited to, the limitations of liability, privacy
                principles, acceptable use policy, and disclaimers regarding encryption reliability
                and legal compliance.
            </p>
            <p>
                Your continued use of the application constitutes your full acceptance of these
                terms. If you do not agree with any part of the agreement, you must discontinue use
                of {APPLICATION_NAME} immediately.
            </p>

            <h2>Open to collaboration</h2>
            <p>
                {APPLICATION_NAME} is not backed by a corporation or a team - it&apos;s a project
                developed by a single enthusiast who believes that{' '}
                <strong>
                    digital security should be simple, private, and accessible to everyone
                </strong>
                . Despite that, I use the pronoun &quot;we&quot; to reflect a vision for the future
                - the belief that, over time, the project will grow into something greater,
                supported by a community of contributors, users, and like-minded people.
            </p>
            <p>
                We&apos;re looking for enthusiasts who want to contribute out of passion, curiosity,
                or the desire to build something meaningful. Whether you&apos;re a developer,
                designer, security researcher, or just someone who believes in the mission - your
                input is welcome.
            </p>
            <p>
                At the same time, we&apos;re also open to{' '}
                <strong>collaboration with companies or organizations</strong> that see value in our
                product and want to support or integrate it into their solutions. If you represent a
                business interested in privacy-focused tools, we&apos;d be glad to talk.
            </p>
            <p>
                Contact the{' '}
                <Link href={GITHUB_URL} target="_blank" rel="noopener">
                    project
                </Link>{' '}
                author - however you prefer. We&apos;re always open to conversation, contribution,
                and ideas.
            </p>
            <p>
                <strong>Version {VERSION}</strong>
            </p>
        </div>
    );
};

About.displayName = 'About';

export default About;

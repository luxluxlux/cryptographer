// TODO: Prepare text
const HowItWorks = () => (
    <div>
        <h2>How does it work?</h2>
        <p>
            We use symmetric encryption and hope that the transfer of the key (password) occurs over
            a secure communication channel, for example, live, or does not occur at all, for
            example, when the file is encrypted and decrypted by the same person. We do not store
            customer data or encryption keys. The final result of the calculation is written to a
            file received by the client, which can only be decrypted in the same application with
            the same configuration.
        </p>
        <h2>Is it reliable?</h2>
        <p>
            Actually, any cipher can be cracked, but we encode the data in such a way that
            today&apos;s computer power is not enough to decrypt the encrypted file. At the same
            time, we do not enlarge the file so much that you experience problems with storing it.
            The specific configuration of the running application is stored (generated) on the
            server and is known only to its administrator.
        </p>
    </div>
);

HowItWorks.displayName = 'HowItWorks';

export default HowItWorks;

import { Helmet } from 'react-helmet-async';
import { APPLICATION_URL } from 'utils/constants';
import { IHeaderProps } from './interfaces';

/**
 * Header content of the page
 * @param props Page header props
 * @returns Page header
 */
const Header = ({ path = '', ...props }: IHeaderProps) => {
    const ogTitle = props.ogTitle ? props.ogTitle : props.metaTitle;
    const ogDescription = props.ogDescription ? props.ogDescription : props.metaDescription;
    return (
        <Helmet>
            <link rel="canonical" href={APPLICATION_URL + path} />
            <meta name="description" content={props.metaDescription} />
            {props.metaKeywords && <meta name="keywords" content={props.metaKeywords} />}
            <meta property="og:title" content={ogTitle} />
            <meta property="og:description" content={ogDescription} />
            <meta property="og:url" content={APPLICATION_URL + path} />
            <meta name="twitter:title" content={ogTitle} />
            <meta name="twitter:description" content={ogDescription} />
        </Helmet>
    );
};

Header.displayName = 'Header';

export default Header;

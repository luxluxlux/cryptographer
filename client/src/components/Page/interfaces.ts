import { ReactNode } from 'react';

/**
 * Page component properties.
 */
export interface IPageProps {
    /**
     * Page logo.
     */
    logo: ReactNode;
    /**
     * Page menu.
     */
    menu: ReactNode;
    /**
     * Page footer.
     */
    footer: ReactNode;
    /**
     * Page content.
     */
    content: ReactNode;
}

/**
 * Page header properties.
 */
export interface IHeaderProps {
    /**
     * Relative path to the page.
     */
    path?: string;
    /**
     * Meta title.
     */
    metaTitle: string;
    /**
     * Meta description.
     */
    metaDescription: string;
    /**
     * Meta keywords.
     */
    metaKeywords?: string;
    /**
     * Open Graph title.
     */
    ogTitle?: string;
    /**
     * Open Graph description.
     */
    ogDescription?: string;
}
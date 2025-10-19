import About from 'windows/About';
import FAQ from 'windows/FAQ';
import HowItWorks from 'windows/HowItWorks';
import LicenseAgreement from 'windows/LicenseAgreement';
import { IWindow } from './interfaces';

// Pop-up windows
export enum WINDOW {
    ABOUT = 'about',
    FAQ = 'faq',
    HOW_IT_WORKS = 'how-it-works',
    LICENSE_AGREEMENT = 'license-agreement',
}

// Data for pop-up widnows
export const WINDOW_DATA: Record<WINDOW, IWindow> = {
    [WINDOW.ABOUT]: {
        path: 'about',
        content: <About />,
    },
    [WINDOW.FAQ]: {
        path: 'faq',
        content: <FAQ />,
    },
    [WINDOW.HOW_IT_WORKS]: {
        path: 'how-it-works',
        content: <HowItWorks />,
    },
    [WINDOW.LICENSE_AGREEMENT]: {
        path: 'license-agreement',
        content: <LicenseAgreement />,
    },
};

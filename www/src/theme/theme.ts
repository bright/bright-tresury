import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'

export const theme = {
    typography: {
        fontFamily: 'Proxima Nova',
        h2: {
            fontWeight: 700,
            fontSize: 18,
            lineHeight: 22,
            letterSpacing: 0,
            align: 'center',
        },
    },
    palette: {
        primary: {
            main: '#0E65F2',
            light: '#E6F0FD',
        },
        secondary: {
            main: '#E6F0FD',
        },
        text: {
            primary: '#1B1D1C',
            secondary: '#0E65F2',
            disabled: '#7B7B7B',
            hint: '#777777',
        },
        background: {
            default: '#FFFFFF',
            paper: '#F5F5F5',
        },
        divider: '#F0F0F0',
        warning: {
            main: '#FF0000',
        },
        success: {
            main: '#009840',
        },
        status: {
            draft: '#B159A9',
            active: '#0E65F2',
            turnedIntoProposal: '#2FD3AE',
            pending: '#FBC13E',
            milestoneSubmission: '#2FD3AE',
            closed: '#1B1D1C',
        },
        network: {
            main: '#0E65F2',
        },
    },
}

export const breakpoints = {
    mobile: 'xs' as Breakpoint,
    tablet: 'sm' as Breakpoint,
    desktop: 'md' as Breakpoint,
}

declare module '@material-ui/core/styles/createPalette' {
    interface Palette {
        network: Palette['primary']
    }

    interface PaletteOptions {
        network: PaletteOptions['primary']
    }
}

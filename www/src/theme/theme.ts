import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";

export const theme = {
    typography: {
        fontFamily: 'Proxima Nova',
        h2: {
            fontWeight: 700,
            fontSize: 18,
            lineHeight: 22,
            letterSpacing: 0
        }
    },
    palette: {
        primary: {
            main: '#0E65F2',
            light: '#E6F0FD'
        },
        secondary: {
            main: '#e6f0fd'
        },
        text: {
            primary: '#1B1D1C',
            secondary: '#7B7B7B',
            disabled: '#7B7B7B',
            hint: '#777777'
        },
        background: {
            default: '#FFFFFF',
            paper: '#F5F5F5'
        }
    }
}

export const breakpoints = {
    mobile: 'xs' as Breakpoint,
    tablet: 'sm' as Breakpoint,
}

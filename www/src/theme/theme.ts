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
            main: '#0E65F2'
        },
        secondary: {
            main: '#E6F0FD'
        },
        text: {
            primary: '#1B1D1C'
        },
        background: {
            default: '#FFFFFF'
        }
    }
}

export const breakpoints = {
    mobile: 'xs' as Breakpoint,
    tablet: 'sm' as Breakpoint,
}

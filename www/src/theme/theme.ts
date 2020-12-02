import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";

export const theme = {
    typography: {
        fontFamily: 'Proxima Nova',
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
            default: '#fff'
        }
    }
}

export const breakpoints = {
    mobile: 'xs' as Breakpoint,
    tablet: 'sm' as Breakpoint,
}

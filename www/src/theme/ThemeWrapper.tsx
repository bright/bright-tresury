import React from "react";
import {createMuiTheme, CssBaseline, ThemeProvider} from "@material-ui/core";

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Proxima Nova',
    }
});

export const ThemeWrapper: React.FC = ({children}) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {children}
        </ThemeProvider>
    );
}

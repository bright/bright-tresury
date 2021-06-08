import React from 'react'
import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core'
import { theme } from './theme'

const muiTheme = createMuiTheme(theme)

export const ThemeWrapper: React.FC = ({ children }) => {
    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}

import React, { PropsWithChildren } from 'react'
import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core'
import { theme } from './theme'

const muiTheme = createMuiTheme(theme)

interface OwnProps {}

export type ThemeWrapperProps = PropsWithChildren<OwnProps>

const ThemeWrapper = ({ children }: ThemeWrapperProps) => {
    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}

export default ThemeWrapper

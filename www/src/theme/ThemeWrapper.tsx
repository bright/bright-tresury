import React, { useState, PropsWithChildren, useEffect } from 'react'
import { createTheme, CssBaseline, ThemeProvider } from '@material-ui/core'
import { useNetworks } from '../networks/useNetworks'
import { theme } from './theme'

const muiTheme = createTheme(theme)

interface State {
    setNetworkColor: (color: string) => void
}

export const ThemeContext = React.createContext<State | undefined>(undefined)

interface OwnProps {}

export type ThemeWrapperProps = PropsWithChildren<OwnProps>

const ThemeWrapper = ({ children }: ThemeWrapperProps) => {
    const [theme, setTheme] = useState(muiTheme)

    const { network } = useNetworks()

    const setNetworkColor = (color: string) => {
        const newTheme = createTheme({
            ...theme,
            palette: {
                ...theme.palette,
                network: {
                    main: color,
                },
            },
        })
        setTheme(newTheme)
    }

    useEffect(() => {
        setNetworkColor(network.color)
    }, [network])

    return (
        <ThemeContext.Provider value={{ setNetworkColor }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = React.useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within an ThemeContextProvider')
    }

    return context
}

export default ThemeWrapper

import { Snackbar } from '@material-ui/core'
import React, { PropsWithChildren, useState } from 'react'
import { useModal } from '../components/modal/useModal'

interface State {
    visible: boolean
    open: () => void
    close: () => void
    setLabel: (label: string) => void
}

export const SnackNotificationsContext = React.createContext<State | undefined>(undefined)

interface OwnProps {}

export type SnackNotificationsContextProviderProps = PropsWithChildren<OwnProps>

const SnackNotificationsContextProvider = ({ children }: SnackNotificationsContextProviderProps) => {
    const { visible, open, close } = useModal()
    const [label, setLabel] = useState('')

    return (
        <SnackNotificationsContext.Provider value={{ visible, open, close, setLabel }}>
            {children}
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={visible}
                onClose={close}
                message={label}
            />
        </SnackNotificationsContext.Provider>
    )
}

export default SnackNotificationsContextProvider

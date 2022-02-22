import { Snackbar } from '@material-ui/core'
import React, { PropsWithChildren, useState } from 'react'
import { useModal } from '../components/modal/useModal'

interface State {
    visible: boolean
    open: (label: React.ReactNode) => void
    close: () => void
}

export const SnackNotificationsContext = React.createContext<State | undefined>(undefined)

interface OwnProps {}

export type SnackNotificationsContextProviderProps = PropsWithChildren<OwnProps>

const SnackNotificationsContextProvider = ({ children }: SnackNotificationsContextProviderProps) => {
    const { visible, open, close } = useModal()
    const [label, setLabel] = useState<React.ReactNode>('')

    const setLabelAndOpen = (label: React.ReactNode) => {
        setLabel(label)
        open()
    }

    return (
        <SnackNotificationsContext.Provider value={{ visible, open: setLabelAndOpen, close }}>
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

import { useState } from 'react'

export interface UseModalResult {
    visible: boolean
    open: () => void
    close: () => void
}

export const useModal = (initialVisible: boolean = false): UseModalResult => {
    const [visible, setVisible] = useState<boolean>(initialVisible)

    const open = () => setVisible(true)

    const close = () => setVisible(false)

    return { visible, open, close }
}

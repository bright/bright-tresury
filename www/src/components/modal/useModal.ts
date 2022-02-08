import { useState } from 'react'

export const useModal = (initialVisible: boolean = false) => {
    const [visible, setVisible] = useState<boolean>(initialVisible)

    const open = () => setVisible(true)

    const close = () => setVisible(false)

    return { visible, open, close }
}

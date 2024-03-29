import React from 'react'

export interface UseMenuResult {
    anchorEl: HTMLElement | null
    open: boolean
    handleOpen: (event?: React.MouseEvent<HTMLElement>) => void
    handleClose: () => void
}

export const useMenu = (): UseMenuResult => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    const handleOpen = (event?: React.MouseEvent<HTMLElement>) => {
        event && setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return {
        anchorEl,
        open: !!anchorEl,
        handleOpen,
        handleClose,
    }
}

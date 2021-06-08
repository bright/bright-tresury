import { IconButton as MaterialIconButton, IconButtonProps as MaterialIconButtonProps } from '@material-ui/core'
import React from 'react'

interface OwnProps {
    svg?: string
    alt?: string
}

export type IconButtonProps = OwnProps & MaterialIconButtonProps

export const IconButton: React.FC<IconButtonProps> = ({ children, svg, alt, ...props }) => {
    return <MaterialIconButton {...props}>{svg ? <img src={svg} alt={alt ?? ''} /> : null}</MaterialIconButton>
}

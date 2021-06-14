import { IconButton as MaterialIconButton, IconButtonProps as MaterialIconButtonProps } from '@material-ui/core'
import React, { PropsWithChildren } from 'react'

interface OwnProps {
    svg?: string
    alt?: string
}

export type IconButtonProps = PropsWithChildren<OwnProps & MaterialIconButtonProps>

const IconButton = ({ children, svg, alt, ...props }: IconButtonProps) => {
    return <MaterialIconButton {...props}>{svg ? <img src={svg} alt={alt ?? ''} /> : null}</MaterialIconButton>
}

export default IconButton

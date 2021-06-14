import React, { PropsWithChildren } from 'react'
import { Divider as MaterialDivider, DividerProps as MaterialDividerProps } from '@material-ui/core'

export type DividerProps = PropsWithChildren<MaterialDividerProps>

const Divider = ({ children, ...props }: DividerProps) => {
    return <MaterialDivider {...props} />
}

export default Divider

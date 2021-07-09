import React, { PropsWithChildren } from 'react'
import { Grid as MaterialGrid, GridProps as MaterialGridProps } from '@material-ui/core'

interface OwnProps {}

export type GridItemProps = PropsWithChildren<OwnProps> & MaterialGridProps

const GridItem = ({ children, ...props }: GridItemProps) => {
    return (
        <MaterialGrid item={true} {...props}>
            {children}
        </MaterialGrid>
    )
}
export default GridItem

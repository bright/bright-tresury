import React, { PropsWithChildren } from 'react'
import { Grid as MaterialGrid } from '@material-ui/core'

interface OwnProps {}

export type GridItemProps = PropsWithChildren<OwnProps>

const GridItem = ({ children }: GridItemProps) => {
    return (
        <MaterialGrid item={true} xs={12} md={6}>
            {children}
        </MaterialGrid>
    )
}
export default GridItem

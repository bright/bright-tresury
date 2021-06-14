import React, { PropsWithChildren } from 'react'
import { Grid as MaterialGrid } from '@material-ui/core'

const GridItem = ({ children }: PropsWithChildren<{}>) => {
    return (
        <MaterialGrid item={true} xs={12} md={6}>
            {children}
        </MaterialGrid>
    )
}
export default GridItem

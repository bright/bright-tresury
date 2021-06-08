import React from 'react'
import { Grid as MaterialGrid } from '@material-ui/core'

export const GridItem: React.FC = ({ children }) => {
    return (
        <MaterialGrid item={true} xs={12} md={6}>
            {children}
        </MaterialGrid>
    )
}

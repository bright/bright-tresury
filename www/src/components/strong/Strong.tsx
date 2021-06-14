import styled from '@material-ui/core/styles/styled'
import React, { PropsWithChildren } from 'react'

interface OwnProps {
    color?: StrongColor
}
export type StrongProps = PropsWithChildren<OwnProps>
export type StrongColor = 'default' | 'primary'
const StyledStrong = styled('strong')(({ theme }) => ({
    color: theme.palette.primary.main,
}))
const Strong = ({ children, color = 'default' }: StrongProps) => {
    if (color === 'primary') {
        return <StyledStrong>{children}</StyledStrong>
    }
    return <strong>{children}</strong>
}
export default Strong

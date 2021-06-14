import { BoxProps } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import styled from '@material-ui/core/styles/styled'
import React, { PropsWithChildren } from 'react'

const StyledBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    borderColor: theme.palette.primary.main,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'center',
    marginLeft: 0,
    marginRight: 0,
}))
interface OwnProps {}
export type InfoProps = PropsWithChildren<OwnProps & BoxProps>
const Info = ({ children, ...props }: InfoProps) => {
    return <StyledBox {...props}>{children}</StyledBox>
}
export default Info

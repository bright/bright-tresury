import {BoxProps,} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import styled from "@material-ui/core/styles/styled";
import React from "react";

const StyledBox = styled(Box)(({theme}) => ({
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
}))

export const Info: React.FC<BoxProps> = ({children, ...props}) => {
    return (
        <StyledBox {...props}>
            {children}
        </StyledBox>
    )
}

const StyledStrong = styled('strong')(({theme}) => ({
    color: theme.palette.primary.main,
}))

export const Strong: React.FC = ({children}) => {
    return (
        <StyledStrong>{children}</StyledStrong>
    )
}
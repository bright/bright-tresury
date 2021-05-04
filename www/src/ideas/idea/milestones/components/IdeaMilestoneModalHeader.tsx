import React from "react";
import styled from '@material-ui/core/styles/styled'

const StyledDiv = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
});

export const IdeaMilestoneModalHeader: React.FC = ({ children }) => {
    return (
        <StyledDiv>
            {children}
        </StyledDiv>
    )
}
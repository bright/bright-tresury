import styled from '@material-ui/core/styles/styled'
import React from 'react'
import { breakpoints } from '../../../../theme/theme'

const NetworkValueInputContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down(breakpoints.mobile)]: {
        flexDirection: 'column',
    },
    paddingTop: '2em',
}))

export default NetworkValueInputContainer

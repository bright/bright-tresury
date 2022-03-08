import React from 'react'
import { styled } from '@material-ui/core'

const DiscussionInfoBox = styled('p')(({ theme }) => ({
    marginTop: 0,
    marginBottom: '24px',
    width: '75%',
    border: '1px solid',
    borderColor: theme.palette.primary.main,
    borderRadius: '8px',
    backgroundColor: theme.palette.primary.light,
    padding: '11px 20px',
}))

export default DiscussionInfoBox

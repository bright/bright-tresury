import styled from '@material-ui/core/styles/styled'
import React from 'react'

const TippingContainer = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingTop: '6px',
    paddingBottom: '6px',
}))

export default TippingContainer

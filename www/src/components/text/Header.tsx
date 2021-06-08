import { createStyles, makeStyles } from '@material-ui/core/styles'

import React from 'react'

const useStyles = makeStyles(() =>
    createStyles({
        header: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1B1D1C',
        },
    }),
)

export const Header: React.FC = ({ children }) => {
    const classes = useStyles()
    return <div className={classes.header}>{children}</div>
}

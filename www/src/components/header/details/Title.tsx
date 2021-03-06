import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            marginTop: '24px',
            marginRight: '.5em',
            fontSize: 18,
            flexBasis: '100%',
            textOverflow: 'ellipsis',
        },
    }),
)

export const Title: React.FC = ({ children }) => {
    const classes = useStyles()
    return <div className={classes.root}>{children}</div>
}

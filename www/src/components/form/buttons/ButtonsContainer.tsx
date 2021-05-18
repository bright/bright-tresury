import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { breakpoints } from '../../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        buttonsContainer: {
            margin: '3em 0',
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            flexDirection: 'row-reverse',
            flexGrow: 1,
            alignItems: 'flex-end',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                justifyContent: 'inherit',
                flexDirection: 'column-reverse',
            },
        },
    }),
)

export const ButtonsContainer: React.FC = ({ children }) => {
    const classes = useStyles()

    return <div className={classes.buttonsContainer}>{children}</div>
}

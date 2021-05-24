import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../theme/theme'

const useStyles = makeStyles((theme: Theme) => {
    return {
        inputField: {
            marginTop: '2em',
            width: '424px',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '75%',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: '1em',
                paddingRight: '1em',
                width: '100%',
            },
        },
    }
})

export const SignComponentWrapper: React.FC = ({ children }) => {
    const classes = useStyles()

    return <div className={classes.inputField}>{children}</div>
}

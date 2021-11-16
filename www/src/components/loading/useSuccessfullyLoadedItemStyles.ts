import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../theme/theme'

export const useSuccessfullyLoadedItemStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            backgroundColor: theme.palette.background.paper,
        },
        content: {
            padding: '2.5em 5em 3em 3em',
            background: theme.palette.background.paper,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '2em 1.5em 3em 1.5em',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: '1em 1.5em 10em 1em',
            },
        },
    }),
)

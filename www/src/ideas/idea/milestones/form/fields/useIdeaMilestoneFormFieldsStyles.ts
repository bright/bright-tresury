import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../../../../theme/theme'

export const useIdeaMilestoneFormFieldsStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            gap: '2em',
            marginTop: '1em',
        },
        narrowField: {
            width: '50%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '100%',
            },
        },
        ideaMilestoneNetworkInput: {
            paddingTop: '8px',
            paddingBottom: '24px',
        },
        withBorder: {
            border: '1px solid',
            borderColor: theme.palette.background.paper,
        },
    }),
)

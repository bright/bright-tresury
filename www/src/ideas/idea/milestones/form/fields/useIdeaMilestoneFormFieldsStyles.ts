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
        withBorder: {
            border: '1px solid',
            borderColor: theme.palette.background.paper,
        },
        statusIndicator: {
            marginLeft: '-6px',
            marginTop: '10px',
            justifyContent: 'start',
        },
        networkInput: {
            marginBottom: '10px',
        },
    }),
)

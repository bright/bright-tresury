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
        dateRangeField: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
        }
    }),
);
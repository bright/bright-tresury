import { useTranslation } from 'react-i18next'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ClassNameProps } from '../../components/props/className.props'
import clsx from 'clsx'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            margin: '5px 0px',
        },
        title: {
            fontSize: '12px',
            textTransform: 'uppercase',
            flex: '0 0 110px',
            color: theme.palette.text.disabled,
        },
        value: {
            fontSize: '14px',
            flex: 1,
        },
    }),
)

interface OwnProps {
    title: string
    value?: string
}
export type IdentityEntryProps = OwnProps & ClassNameProps

const IdentityEntry = ({ title, value, className }: IdentityEntryProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    return (
        <div className={clsx(classes.root, className)}>
            <span className={classes.title}>{title}</span>
            <span className={classes.value}>{value ?? t('common.na')}</span>
        </div>
    )
}
export default IdentityEntry

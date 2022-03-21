import useIdentity from '../../util/useIdentity'
import IdentityEntry from './IdentityEntry'
import { useTranslation } from 'react-i18next'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            fontSize: '12px',
            color: theme.palette.text.disabled,
            textTransform: 'uppercase',
        },
        legal: {
            fontSize: '16px',
            fontWeight: 'bold',
        },
    }),
)

interface OwnProps {
    address: string
}

export type IdentityProps = OwnProps

const Identity = ({ address }: IdentityProps) => {
    const classes = useStyles()
    const { identity } = useIdentity({ address })
    const { t } = useTranslation()
    return (
        <>
            <p className={classes.title}>{t('components.identity.identity')}</p>
            <p className={classes.legal}>{identity?.legal ?? ''}</p>
            <IdentityEntry title={t('components.identity.email')} value={identity?.email} />
            <IdentityEntry title={t('components.identity.twitter')} value={identity?.twitter} />
            <IdentityEntry title={t('components.identity.riot')} value={identity?.riot} />
            <IdentityEntry title={t('components.identity.web')} value={identity?.web} />
            <IdentityEntry title={t('components.identity.pgp')} value={identity?.pgp} />
        </>
    )
}

export default Identity

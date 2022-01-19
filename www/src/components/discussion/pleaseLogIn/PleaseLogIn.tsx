import React from 'react'
import { useTranslation } from 'react-i18next'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Link from '../../link/Link'
import { useHistory } from 'react-router'
import { ROUTE_SIGNIN } from '../../../routes/routes'
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            fontSize: '14px',
            fontWeight: 400,
            margin: '8px',
            marginTop: '12px',
            width: '100%',
        },
        pleaseLogIn: {
            fontStyle: 'italic',
        },
        link: {
            textDecoration: 'none',
            fontWeight: 600,
            color: theme.palette.text.secondary,
            cursor: 'pointer',
        },
    }),
)

const PleaseLogIn = () => {
    const classes = useStyles()
    const { t } = useTranslation()
    const history = useHistory()
    return (
        <div className={classes.root}>
            <span className={classes.pleaseLogIn}>{t('discussion.inOrderToComment')}</span>
            <Link className={classes.link} onClick={() => history.push(ROUTE_SIGNIN)}>
                {t('discussion.logIn')}
            </Link>
        </div>
    )
}
export default PleaseLogIn

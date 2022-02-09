import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles, Theme } from '@material-ui/core'
import menuDrawing from '../../assets/menu_drawing.svg'
import treasuryLabeledLogo from '../../assets/treasury_labeled_logo.svg'
import { useTranslation } from 'react-i18next'
import Link from '../../components/link/Link'
import config from '../../config'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: 32,
            marginBottom: 32,
            padding: '32px 32px 0 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        drawing: {
            width: '100%',
        },
        whatForLabel: {
            fontSize: 14,
            marginTop: 16,
        },
        learnMoreButton: {
            marginTop: 20,
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.primary.main,
            fontWeight: 600,
            borderRadius: '8px',
            padding: '.5em 2em',
        },
        logo: {
            marginTop: 30,
            width: '100%',
            height: 32,
        },
        buildInfo: {
            fontSize: '14px',
            position: 'relative',
            bottom: '-10px',
            left: '-104px',
        },
    }),
)

const MenuAppInfo = () => {
    const classes = useStyles()
    const { t } = useTranslation()
    const isStageOrQa = config.env === 'stage' || config.env === 'qa'

    return (
        <div className={classes.root}>
            <img className={classes.drawing} src={menuDrawing} alt={''} />
            <div className={classes.whatForLabel}>{t('menu.whatForLabel')}</div>
            <Link
                className={classes.learnMoreButton}
                href="https://brightinventions.pl/blog/bright-treasury-is-now-live/"
            >
                {t('menu.learnMoreLabel')}
            </Link>
            <img className={classes.logo} src={treasuryLabeledLogo} alt={t('menu.logo')} />
            {isStageOrQa ? (
                <div className={classes.buildInfo}>
                    {t('menu.build')} {process.env.REACT_APP_VCS_SHORT_VERSION}
                </div>
            ) : null}
        </div>
    )
}

export default MenuAppInfo

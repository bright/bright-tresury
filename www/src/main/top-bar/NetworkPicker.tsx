import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import polkadotLogoSrc from '../../assets/polkadot_logo.svg'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
        },
        image: {
            width: '41px',
            height: '41px',
        },
        text: {
            color: '#FFFFFF',
            fontSize: '22px',
            fontWeight: 600,
        },
    }),
)

const NetworkPicker = () => {
    const classes = useStyles()

    const { t } = useTranslation()

    return (
        <div className={classes.root}>
            <img src={polkadotLogoSrc} alt={t('topBar.network.polkadotLogoAlt')} className={classes.image} />
            <div className={classes.text}>{t('topBar.network.development')}</div>
        </div>
    )
}

export default NetworkPicker

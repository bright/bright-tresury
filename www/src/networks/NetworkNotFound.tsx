import React from 'react'
import { useTranslation } from 'react-i18next'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import logoImage from '../assets/treasury_labeled_logo.svg'
import Button from '../components/button/Button'
import NetworkName from '../main/top-bar/network/NetworkName'
import { Network } from './networks.dto'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            marginTop: '40px',
            marginBottom: '0px',
            fontSize: '18px',
            fontWeight: 'bold',
        },
        subTitle: {
            fontSize: '16px',
            marginBottom: '100px',
        },
        image: {
            height: '40px',
        },
        buttonsWrapper: {
            display: 'flex',
        },
        button: {
            marginLeft: '60px',
            marginRight: '60px',
        },
    }),
)

interface OwnProps {
    networks: Network[]
    selectNetwork: (networkId: string) => void
}

export type NetworkNotFoundProps = OwnProps

const NetworkNotFound = ({ networks, selectNetwork }: NetworkNotFoundProps) => {
    const classes = useStyles()

    const { t } = useTranslation()

    return (
        <div className={classes.root}>
            <img className={classes.image} src={logoImage} alt={''} />
            <p className={classes.title}>{t('networks.networkNotFound.title')}</p>
            <p className={classes.subTitle}>{t('networks.networkNotFound.subtitle')}</p>
            <div className={classes.buttonsWrapper}>
                {networks.map((network) => (
                    <Button
                        className={classes.button}
                        backgroundColor={network.color}
                        onClick={() => selectNetwork(network.id)}
                    >
                        <NetworkName network={network} />
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default NetworkNotFound

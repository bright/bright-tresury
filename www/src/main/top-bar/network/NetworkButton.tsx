import { Button as MaterialButton, createStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import arrowSvg from '../../../assets/account_menu_arrow.svg'
import { Network } from '../../../networks/networks.dto'
import NetworkName from './NetworkName'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            textTransform: 'none',
        },
        moreImg: {
            padding: '12px',
        },
    }),
)

interface OwnProps {
    network: Network
    onClick: () => void
}

export type NetworkButtonProps = OwnProps

const NetworkButton = ({ network, onClick }: NetworkButtonProps) => {
    const { t } = useTranslation()

    const classes = useStyles({})
    return (
        <MaterialButton onClick={onClick} variant={'text'} className={classes.root}>
            <NetworkName network={network} />
            <img className={classes.moreImg} alt={t('topBar.network.moreNetworks')} src={arrowSvg} />
        </MaterialButton>
    )
}

export default NetworkButton

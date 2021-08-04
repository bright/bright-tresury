import { Button as MaterialButton, createStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import arrowSvg from '../../../assets/account_menu_arrow.svg'
import IconButton from '../../../components/button/IconButton'
import { Network } from '../../../networks/networks.dto'
import NetworkName from './NetworkName'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            textTransform: 'none',
        },
    }),
)

interface OwnProps {
    network: Network
    onClick: () => void
}

export type NetworkProps = OwnProps

const NetworkButton = ({ network, onClick }: NetworkProps) => {
    const { t } = useTranslation()

    const classes = useStyles({})
    return (
        <MaterialButton onClick={onClick} variant={'text'} className={classes.root}>
            <NetworkName network={network} />
            <IconButton alt={t('topBar.network.moreNetworks')} svg={arrowSvg} />
        </MaterialButton>
    )
}

export default NetworkButton

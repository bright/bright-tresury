import { createStyles, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Network } from '../../../networks/networks.dto'
import { getNetworkLogo, NetworkLogoVariant } from './assets/assets'

const useStyles = makeStyles<Theme, NetworkNameStylesProps>((theme: Theme) =>
    createStyles({
        image: {
            height: ({ isMenuItem }) => (isMenuItem ? '20px' : '26px'),
        },
        text: {
            color: ({ isMenuItem }) => (isMenuItem ? theme.palette.text.primary : theme.palette.background.default),
            fontSize: ({ isMenuItem }) => (isMenuItem ? '18px' : '22px'),
            fontWeight: 600,
        },
    }),
)

interface OwnProps {
    network: Network
}

export interface NetworkNameStylesProps {
    isMenuItem?: boolean
}

export type NetworkNameProps = OwnProps & NetworkNameStylesProps

const NetworkName = ({ network, isMenuItem = false }: NetworkNameProps) => {
    const { t } = useTranslation()

    const classes = useStyles({ isMenuItem })

    const variant = isMenuItem ? NetworkLogoVariant.Dark : NetworkLogoVariant.Light
    const image = getNetworkLogo(variant, network.id)

    return (
        <>
            {image ? (
                <img src={image} alt={t('topBar.network.logo')} className={classes.image} />
            ) : (
                <div className={classes.text}>{network.name}</div>
            )}
        </>
    )
}

export default NetworkName

import { createStyles, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ClassNameProps } from '../../../components/props/className.props'
import { Network } from '../../../networks/networks.dto'
import { getNetworkLogo } from './assets/assets'
import clsx from 'clsx'

const useStyles = makeStyles<Theme, NetworkNameStylesProps>((theme: Theme) =>
    createStyles({
        image: {
            height: ({ variant }) => (variant === 'dark' ? '20px' : '26px'),
        },
        text: {
            color: ({ variant }) =>
                variant === 'dark' ? theme.palette.text.primary : theme.palette.background.default,
            fontSize: ({ variant }) => (variant === 'dark' ? '18px' : '22px'),
            fontWeight: 600,
        },
    }),
)

interface OwnProps {
    network: Network
}

export interface NetworkNameStylesProps {
    variant?: NetworkNameVariant
}

export type NetworkNameVariant = 'light' | 'dark'

export type NetworkNameProps = OwnProps & NetworkNameStylesProps & ClassNameProps

const NetworkName = ({ network, variant = 'light', className }: NetworkNameProps) => {
    const { t } = useTranslation()

    const classes = useStyles({ variant })

    const image = getNetworkLogo(variant, network.id)

    return (
        <>
            {image ? (
                <img src={image} alt={t('topBar.network.logo')} className={clsx(classes.image, className)} />
            ) : (
                <div className={clsx(classes.text, className)}>{network.name}</div>
            )}
        </>
    )
}

export default NetworkName

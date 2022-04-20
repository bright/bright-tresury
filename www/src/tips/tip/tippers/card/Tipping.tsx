import { createStyles, makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import StyledSmallAmount from '../../../../components/amount/StyledSmallAmount'
import { ClassNameProps } from '../../../../components/props/className.props'
import User from '../../../../components/user/User'
import { useNetworks } from '../../../../networks/useNetworks'
import { PublicUserDto } from '../../../../util/publicUser.dto'
import { toFixedDecimals, toNetworkDisplayValue } from '../../../../util/quota.util'
import { NetworkPlanckValue } from '../../../../util/types'
import { TippingDto } from '../../../tips.dto'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            paddingTop: '6px',
            paddingBottom: '6px',
        },
        pending: {
            marginRight: '6px',
        },
    }),
)

interface OwnProps {
    tipping: TippingDto | { tipper: PublicUserDto; value?: NetworkPlanckValue }
}

export type TippingProps = OwnProps & ClassNameProps

const Tipping = ({ tipping: { tipper, value }, className }: TippingProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { network } = useNetworks()

    const fixedDecimalsValue = useCallback(
        (val: NetworkPlanckValue) => toFixedDecimals(toNetworkDisplayValue(val, network.decimals), 4),
        [network],
    )

    return (
        <div className={clsx(className, classes.root)}>
            <User user={tipper} />
            {value !== undefined ? (
                <StyledSmallAmount amount={fixedDecimalsValue(value)} currency={network.currency} />
            ) : (
                <p className={classes.pending}>{t('tip.tippers.pending')}</p>
            )}
        </div>
    )
}

export default Tipping

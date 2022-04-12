import { createStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Bond from '../../../components/form/input/networkValue/Bond'
import { ClassNameProps } from '../../../components/props/className.props'
import { useNetworks } from '../../../networks/useNetworks'
import { calculateBondValue } from '../../../util/tips-bounties-bond/bondUtil'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginTop: '2em',
        },
    }),
)

interface OwnProps {
    blockchainDescription: string
}

export type TipBondProps = OwnProps & ClassNameProps

const TipBond = ({ blockchainDescription }: TipBondProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { network } = useNetworks()

    const depositValue = calculateBondValue(
        blockchainDescription,
        network.tips.tipReportDepositBase,
        network.tips.dataDepositPerByte,
    )

    return (
        <Bond
            className={classes.root}
            network={network}
            bondValue={depositValue}
            label={t('tip.form.fields.deposit')}
            tipLabel={t('tip.form.fields.depositTooltip')}
        />
    )
}

export default TipBond

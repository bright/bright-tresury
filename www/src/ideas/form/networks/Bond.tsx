import FormGroup from '@material-ui/core/FormGroup'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import TextField from '../../../components/form/input/TextField'
import InformationTip from '../../../components/info/InformationTip'
import { ClassNameProps } from '../../../components/props/className.props'
import { Label } from '../../../components/text/Label'
import { calculateBondValue } from '../../../networks/bondUtil'
import { breakpoints } from '../../../theme/theme'
import { Network } from '../../../networks/networks.dto'
import { NetworkPlanckValue } from '../../../util/types'
import { toNetworkDisplayValue } from '../../../util/quota.util'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        input: {
            width: '164px',
            marginRight: '18px',
        },
        content: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                flexDirection: 'column',
                alignItems: 'flex-start',
            },
        },
        tip: {
            marginTop: '8px',
            marginBottom: '8px',
        },
    }),
)

interface OwnProps {
    network: Network
    value: NetworkPlanckValue
}

export type BondProps = OwnProps & ClassNameProps

const Bond = ({ network, value, className }: BondProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const bond = calculateBondValue(value, network.bond.percentage, network.bond.minValue)

    const tipLabel =
        bond === network.bond.minValue ? (
            t('idea.details.form.networks.bond.min')
        ) : (
            <Trans
                i18nKey="idea.details.form.networks.bond.percentage"
                values={{ percentage: network.bond.percentage }}
            />
        )

    return (
        <FormGroup className={className}>
            <Label label={t('idea.details.form.networks.bond.name')} />
            <div className={classes.content}>
                <TextField disabled={true} name={''} type={`number`} value={toNetworkDisplayValue(bond, network.decimals)} className={classes.input} />
                <InformationTip className={classes.tip} label={tipLabel} />
            </div>
        </FormGroup>
    )
}

export default Bond

import FormGroup from '@material-ui/core/FormGroup'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import TextField from '../../../components/form/input/TextField'
import InformationTip from '../../../components/info/InformationTip'
import { ClassNameProps } from '../../../components/props/className.props'
import { Label } from '../../../components/text/Label'
import { calculateBondValue } from '../../../networks/bondUtil'
import { useNetworks } from '../../../networks/useNetworks'
import { breakpoints } from '../../../theme/theme'
import { IdeaNetworkDto } from '../../ideas.dto'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        input: {
            width: '164px',
            marginRight: '18px',
        },
        content: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                flexDirection: 'column',
                alignItems: 'flex-start',
            },
        },
        tip: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                marginTop: '8px',
            },
        },
    }),
)

interface OwnProps {
    ideaNetwork: IdeaNetworkDto
}

export type BondProps = OwnProps & ClassNameProps

const Bond = ({ ideaNetwork, className }: BondProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { networks } = useNetworks()

    const selectedNetwork = networks.find((n) => n.id === ideaNetwork.name)!

    const bond = calculateBondValue(ideaNetwork.value, selectedNetwork.bond.percentage, selectedNetwork.bond.minValue)

    const tipLabel =
        bond == selectedNetwork.bond.minValue ? (
            t('idea.details.form.networks.bond.min')
        ) : (
            <Trans
                i18nKey="idea.details.form.networks.bond.percentage"
                values={{
                    percentage: selectedNetwork.bond.percentage,
                }}
            />
        )

    return (
        <FormGroup className={className}>
            <Label label={t('idea.details.form.networks.bond.name')} />
            <div className={classes.content}>
                <TextField disabled={true} name={''} type={`number`} value={bond} className={classes.input} />
                <InformationTip className={classes.tip} label={tipLabel} />
            </div>
        </FormGroup>
    )
}

export default Bond

import FormGroup from '@material-ui/core/FormGroup'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { ReactElement } from 'react'
import TextField from '../../../../components/form/input/TextField'
import InformationTip from '../../../../components/info/InformationTip'
import { ClassNameProps } from '../../../../components/props/className.props'
import { Label } from '../../../../components/text/Label'
import { Network } from '../../../../networks/networks.dto'
import { breakpoints } from '../../../../theme/theme'
import { toNetworkDisplayValue } from '../../../../util/quota.util'
import { NetworkPlanckValue } from '../../../../util/types'

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
    bondValue: NetworkPlanckValue
    tipLabel: string | ReactElement
    label: string
}

export type BondProps = OwnProps & ClassNameProps

const Bond = ({ network, bondValue, tipLabel, label, className }: BondProps) => {
    const classes = useStyles()

    return (
        <FormGroup className={className}>
            <Label label={label} />
            <div className={classes.content}>
                <TextField
                    disabled={true}
                    name={''}
                    type={`number`}
                    value={toNetworkDisplayValue(bondValue, network.decimals)}
                    className={classes.input}
                />
                <InformationTip className={classes.tip} label={tipLabel} />
            </div>
        </FormGroup>
    )
}

export default Bond

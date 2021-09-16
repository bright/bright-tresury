import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../../../components/form/input/Input'
import TextField from '../../../components/form/input/TextField'
import { ClassNameProps } from '../../../components/props/className.props'
import { Label } from '../../../components/text/Label'
import { useNetworks } from '../../../networks/useNetworks'
import { breakpoints } from '../../../theme/theme'
import Bond from './Bond'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                flexDirection: 'column',
            },
        },
        bond: {
            marginTop: '2em',
        },
        value: {
            width: '164px',
            marginRight: '52px',
        },
        valueContainer: {
            marginTop: '2em',
        },
    }),
)

interface OwnProps {
    inputName?: string
    readonly?: boolean
    networkId: string
    value: number
}

export type NetworkInputProps = OwnProps & ClassNameProps

const NetworkInput = ({ inputName, networkId, value, className, readonly = false }: NetworkInputProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { networks } = useNetworks()

    const selectedNetwork = networks.find((n) => n.id === networkId)!

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.valueContainer}>
                {!readonly && inputName ? (
                    <Input
                        className={classes.value}
                        name={inputName}
                        type={`number`}
                        label={t('idea.details.form.networks.reward')}
                        placeholder={t('idea.details.form.networks.reward')}
                        endAdornment={selectedNetwork.currency}
                    />
                ) : (
                    <>
                        <Label label={t('idea.details.form.networks.reward')} />
                        <TextField
                            className={classes.value}
                            disabled={true}
                            value={value}
                            placeholder={t('idea.details.form.networks.reward')}
                            endAdornment={selectedNetwork.currency}
                        />
                    </>
                )}
            </div>
            <Bond className={classes.bond} network={selectedNetwork} value={value} />
        </div>
    )
}

export default NetworkInput

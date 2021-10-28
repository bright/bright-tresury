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
import { NetworkDisplayValue, Nil } from '../../../util/types'
import {
    hasPositiveDigit,
    isCorrectDecimalPrecision,
    isNotNegative,
    isValidNumber,
    toNetworkPlanckValue,
} from '../../../util/quota.util'
import * as Yup from 'yup'
import { Network } from '../../../networks/networks.dto'
import { TestContext } from 'yup'

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
/**
 * Wraps yupTestFunction with a null/undefined check => returns true if value is undefined or null
 * @param testFunction
 */
function optional(yupTestFunction: (value: string, context: TestContext) => boolean) {
    return function (value: string | undefined, context: TestContext) {
        if (value === undefined || value === null) return true
        return yupTestFunction(value, context)
    }
}

interface NetworkValueYupValidation {
    t: (key: string) => string
    findNetwork: (networkId: string) => Nil<Network>
    required?: Nil<boolean>
}
export const networkValueValidationSchema = ({ t, findNetwork, required = false }: NetworkValueYupValidation) => {
    let validationSchema = Yup.string()
        .test('is-not-negative', t('idea.details.form.valueCannotBeLessThanZero'), optional(isNotNegative))
        .test('is-valid-number', t('idea.details.form.notValidNumber'), optional(isValidNumber))
        .test(
            'correct-decimal-precision',
            t('idea.details.form.tooManyDecimals'),
            optional((value, context) => isCorrectDecimalPrecision(value, findNetwork(context.parent.name)!.decimals)),
        )
    if (required)
        validationSchema = validationSchema
            .required(t('idea.details.form.emptyFieldError'))
            .test('more-then-zero', t('idea.details.form.moreThanZero'), optional(hasPositiveDigit))
    return validationSchema
}
interface OwnProps {
    inputName?: string
    readonly?: boolean
    networkId: string
    value: NetworkDisplayValue
}

export type NetworkInputProps = OwnProps & ClassNameProps

const NetworkInput = ({ inputName, networkId, value, className, readonly = false }: NetworkInputProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { findNetwork } = useNetworks()
    const network = findNetwork(networkId)!

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.valueContainer}>
                {!readonly && inputName ? (
                    <Input
                        className={classes.value}
                        name={inputName}
                        type={`text`}
                        label={t('idea.details.form.networks.reward')}
                        placeholder={t('idea.details.form.networks.reward')}
                        endAdornment={network.currency}
                    />
                ) : (
                    <>
                        <Label label={t('idea.details.form.networks.reward')} />
                        <TextField
                            className={classes.value}
                            disabled={true}
                            value={value}
                            placeholder={t('idea.details.form.networks.reward')}
                            endAdornment={network.currency}
                        />
                    </>
                )}
            </div>
            <Bond className={classes.bond} network={network} value={toNetworkPlanckValue(value, network.decimals)!} />
        </div>
    )
}

export default NetworkInput

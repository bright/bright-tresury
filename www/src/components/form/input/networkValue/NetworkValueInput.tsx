import { createStyles, makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'
import * as Yup from 'yup'
import { TestContext } from 'yup'
import { Network } from '../../../../networks/networks.dto'
import { useNetworks } from '../../../../networks/useNetworks'
import { hasPositiveDigit, isCorrectDecimalPrecision, isNotNegative, isValidNumber } from '../../../../util/quota.util'
import { NetworkDisplayValue, Nil } from '../../../../util/types'
import { ClassNameProps } from '../../../props/className.props'
import { Label } from '../../../text/Label'
import Input from '../Input'
import TextField from '../TextField'

const useStyles = makeStyles(() =>
    createStyles({
        value: {
            width: '164px',
            marginRight: '52px',
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
        .test('is-not-negative', t('form.networkValueInput.valueCannotBeLessThanZero'), optional(isNotNegative))
        .test('is-valid-number', t('form.networkValueInput.notValidNumber'), optional(isValidNumber))
        .test(
            'correct-decimal-precision',
            t('form.networkValueInput.tooManyDecimals'),
            optional((value, context) => isCorrectDecimalPrecision(value, findNetwork(context.parent.name)!.decimals)),
        )
    if (required)
        validationSchema = validationSchema
            .required(t('form.networkValueInput.emptyFieldError'))
            .test('more-then-zero', t('form.networkValueInput.moreThanZero'), optional(hasPositiveDigit))
    return validationSchema
}

interface OwnProps {
    label: string
    networkId: string
}

export interface InputFieldProps {
    readonly: false
    inputName: string
}

export interface TextFieldProps {
    readonly: true
    value: NetworkDisplayValue
}

export type NetworkValueInputProps = OwnProps & (InputFieldProps | TextFieldProps) & ClassNameProps

const NetworkValueInput = ({ networkId, label, className, ...props }: NetworkValueInputProps) => {
    const classes = useStyles()
    const { findNetwork } = useNetworks()
    const network = findNetwork(networkId)!

    return (
        <div>
            {!props.readonly ? (
                <Input
                    className={clsx(classes.value)}
                    name={props.inputName}
                    type={`text`}
                    label={label}
                    placeholder={label}
                    endAdornment={network.currency}
                />
            ) : (
                <div>
                    <Label label={label} />
                    <TextField
                        className={clsx(classes.value)}
                        disabled={true}
                        value={props.value}
                        placeholder={label}
                        endAdornment={network.currency}
                    />
                </div>
            )}
        </div>
    )
}

export default NetworkValueInput

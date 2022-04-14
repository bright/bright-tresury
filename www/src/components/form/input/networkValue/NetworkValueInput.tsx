import { createStyles, makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React, { ReactNode } from 'react'
import * as Yup from 'yup'
import { TestContext } from 'yup'
import { Network } from '../../../../networks/networks.dto'
import { useNetworks } from '../../../../networks/useNetworks'
import { breakpoints } from '../../../../theme/theme'
import { hasPositiveDigit, isCorrectDecimalPrecision, isNotNegative, isValidNumber } from '../../../../util/quota.util'
import { NetworkDisplayValue, Nil } from '../../../../util/types'
import { ClassNameProps } from '../../../props/className.props'
import { Label } from '../../../text/Label'
import Input from '../Input'
import TextField from '../TextField'
import WithInformationTip from '../WithInformationTip'

const useStyles = makeStyles((theme) =>
    createStyles({
        value: {
            width: '164px',
            marginRight: '52px',
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

/**
 * Wraps yupTestFunction with a null/undefined check => returns true if value is undefined or null
 * @param testFunction
 */
export function optional(yupTestFunction: (value: string, context: TestContext) => boolean) {
    return function (value: string | undefined, context: TestContext) {
        if (value === undefined || value === null) return true
        return yupTestFunction(value, context)
    }
}

interface NetworkValueYupValidation {
    t: (key: string) => string
    findNetwork: (networkId: string) => Nil<Network>
    decimals?: number
    required?: Nil<boolean>
    nonZero?: Nil<boolean>
}

export const networkValueValidationSchema = ({
    t,
    findNetwork,
    decimals,
    required = false,
    nonZero = false,
}: NetworkValueYupValidation) => {
    let validationSchema = Yup.string()
        .test('is-not-negative', t('form.networkValueInput.valueCannotBeLessThanZero'), optional(isNotNegative))
        .test('is-valid-number', t('form.networkValueInput.notValidNumber'), optional(isValidNumber))
        .test(
            'correct-decimal-precision',
            t('form.networkValueInput.tooManyDecimals'),
            optional((value, context) =>
                isCorrectDecimalPrecision(value, decimals ?? findNetwork(context.parent.name)!.decimals),
            ),
        )
    if (required) validationSchema = validationSchema.required(t('form.networkValueInput.emptyFieldError'))

    if (nonZero)
        validationSchema = validationSchema.test(
            'more-then-zero',
            t('form.networkValueInput.moreThanZero'),
            optional(hasPositiveDigit),
        )

    return validationSchema
}

interface OwnProps {
    label: string
    networkId: string
    tipLabel?: Nil<ReactNode>
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

const NetworkValueInput = ({ networkId, label, tipLabel, className, ...props }: NetworkValueInputProps) => {
    const classes = useStyles()
    const { findNetwork } = useNetworks()
    const network = findNetwork(networkId)!

    return (
        <div>
            {!props.readonly ? (
                <Input
                    {...props}
                    className={clsx(classes.value, className)}
                    name={props.inputName}
                    type={`text`}
                    label={label}
                    placeholder={label}
                    endAdornment={network.currency}
                />
            ) : (
                <div className={className}>
                    <Label label={label} />
                    <WithInformationTip tipLabel={tipLabel}>
                        <TextField
                            {...props}
                            className={clsx(classes.value)}
                            disabled={true}
                            value={props.value}
                            placeholder={label}
                            endAdornment={network.currency}
                        />
                    </WithInformationTip>
                </div>
            )}
        </div>
    )
}

export default NetworkValueInput

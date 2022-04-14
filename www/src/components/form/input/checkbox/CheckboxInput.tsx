import { createStyles } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { useField } from 'formik'
import { FieldHookConfig } from 'formik/dist/Field'
import React from 'react'
import { ClassNameProps } from '../../../props/className.props'
import ErrorLabel from '../ErrorLabel'
import Checkbox, { CheckboxProps, CheckboxVariant } from './Checkbox'

const useStyles = makeStyles<Theme, StyleProps>(() =>
    createStyles({
        root: {
            marginBottom: '5px',
        },
        label: {
            marginLeft: '12px',
            fontSize: ({ variant }) => (variant === 'simple' ? '12px' : '16px'),
            fontWeight: ({ variant }) => (variant === 'simple' ? undefined : 700),
        },
        errorLabel: {
            marginTop: '5px',
        },
    }),
)

const useCheckboxStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '0 0 0 10px',
        },
    }),
)

interface OwnProps {
    label: string | JSX.Element
}

interface StyleProps {
    variant?: CheckboxVariant
}

export type CheckboxInputProps = OwnProps & StyleProps & CheckboxProps & FieldHookConfig<any> & ClassNameProps

export const CheckboxInput = ({ label, className, variant = 'simple', ...props }: CheckboxInputProps) => {
    const classes = useStyles({ variant })
    const checkboxClasses = useCheckboxStyles()

    const [field, meta] = useField({ ...props })
    const hasError: boolean = meta.touched && Boolean(meta.error)

    return (
        <FormControl className={className} error={hasError} component="fieldset">
            <FormGroup>
                <FormControlLabel
                    className={classes.root}
                    control={
                        <Checkbox
                            {...props}
                            variant={variant}
                            classes={checkboxClasses}
                            checked={field.value}
                            inputProps={{ ...field, ...meta }}
                        />
                    }
                    label={<Typography className={classes.label}>{label}</Typography>}
                />
            </FormGroup>
            <ErrorLabel className={classes.errorLabel} touched={meta.touched} errorMessage={meta.error} />
        </FormControl>
    )
}

export default CheckboxInput

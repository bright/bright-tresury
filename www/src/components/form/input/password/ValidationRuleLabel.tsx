import { createStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import crossIcon from '../../../../assets/validation_rules_cross.svg'
import tickIcon from '../../../../assets/validation_rules_tick.svg'
import { formikErrorToArray } from '../../../../util/form.util'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
            marginTop: '1em',
        },
        icon: {
            margin: '0 7px',
            height: '6px',
        },
        label: {
            fontSize: '12px',
            margin: 0,
        },
        labelActive: {
            fontWeight: 'bold',
        },
        labelInactive: {
            color: '#7B7B7B',
        },
    }),
)

export interface ValidationRuleLabelProps {
    message: string
    error?: string | string[]
}

const ValidationRuleLabel = ({ message, error }: ValidationRuleLabelProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const isError = formikErrorToArray(error)?.includes(message)

    const labelClass = isError ? classes.labelInactive : classes.labelActive
    const iconSrc = isError ? crossIcon : tickIcon
    const iconAlt = isError
        ? t('auth.signUp.emailSignUp.form.password.validationError')
        : t('auth.signUp.emailSignUp.form.password.validationOk')

    return (
        <div className={classes.root}>
            <img src={iconSrc} className={classes.icon} alt={iconAlt} />
            <p className={`${classes.label} ${labelClass}`}>{message}</p>
        </div>
    )
}

export default ValidationRuleLabel

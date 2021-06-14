import Button, { ButtonProps } from '../../../components/button/Button'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => {
    return {
        root: {
            marginTop: '2em',
        },
    }
})

interface OwnProps {
    label?: string
}

type Props = OwnProps & ButtonProps

export const SignUpButton = ({ label, ...props }: Props) => {
    const { t } = useTranslation()
    const classes = useStyles()
    return (
        <Button {...props} variant="contained" color="primary" type="submit" className={classes.root}>
            {label || t('auth.signUp.submitButton')}
        </Button>
    )
}

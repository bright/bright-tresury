import React from 'react'
import Button, { ButtonProps } from '../../../components/button/Button'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(() =>
    createStyles({
        buttons: {
            display: 'flex',
            flexDirection: 'column',
        },
        button: {
            marginTop: '3em',
        },
    }),
)

export const SignInButton: React.FC<ButtonProps> = (props) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <div className={classes.buttons}>
            <Button className={classes.button} {...props} variant="contained" color="primary" type="submit">
                {t('auth.signIn.submitButton')}
            </Button>
        </div>
    )
}

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import errorSvg from '../../../../assets/error.svg'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        verifyError: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            fontWeight: 'bold',
            color: theme.palette.warning.main,
            marginRight: '14px',
        },
        errorIcon: {
            width: '20px',
            height: '20px',
            marginRight: '8px',
        },
    }),
)

const VerifyErrorLabel = () => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <div className={classes.verifyError}>
            <img
                className={classes.errorIcon}
                src={errorSvg}
                alt={t('account.emailPassword.emailVerificationNeeded')}
            />
            <p>{t('account.emailPassword.emailVerificationNeeded')}</p>
        </div>
    )
}

export default VerifyErrorLabel

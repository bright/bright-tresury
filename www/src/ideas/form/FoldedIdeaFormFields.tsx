import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../../components/form/input/Input'
import { breakpoints } from '../../theme/theme'
import { IdeaFormValues } from './IdeaForm'
import NetworkInput from './networks/NetworkInput'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        inputField: {
            marginTop: '2em',
        },
        smallField: {
            width: '50%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '100%',
            },
        },
    }),
)

interface OwnProps {
    values: IdeaFormValues
}

export type FoldedIdeaFormFieldsProps = OwnProps

const FoldedIdeaFormFields = ({ values }: FoldedIdeaFormFieldsProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <>
            <div className={classes.inputField}>
                <Input name="title" placeholder={t('idea.details.title')} label={t('idea.details.title')} />
            </div>
            <div className={clsx(classes.inputField, classes.smallField)}>
                <Input
                    name="beneficiary"
                    placeholder={t('idea.details.beneficiary')}
                    label={t('idea.details.beneficiary')}
                />
            </div>
            <NetworkInput
                className={classes.inputField}
                inputName={'currentNetwork.value'}
                ideaNetwork={values.currentNetwork}
            />
        </>
    )
}

export default FoldedIdeaFormFields

import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import StyledSmallInput from '../../components/form/input/StyledSmallInput'
import TitleInput from '../../idea-proposal-details/form/TitleInput'
import NetworkInput from './networks/NetworkInput'
import { IdeaFormValues } from './useIdeaForm'

const useStyles = makeStyles(() =>
    createStyles({
        inputField: {
            marginTop: '2em',
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
            <TitleInput />
            <StyledSmallInput
                name="beneficiary"
                placeholder={t('idea.details.beneficiary')}
                label={t('idea.details.beneficiary')}
            />
            <NetworkInput
                className={classes.inputField}
                inputName={'currentNetwork.value'}
                networkId={values.currentNetwork.name}
                value={values.currentNetwork.value}
            />
        </>
    )
}

export default FoldedIdeaFormFields

import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import TitleInput from '../../idea-proposal-details/form/TitleInput'
import BeneficiaryField from './fields/BeneficiaryField'
import IdeaNetworkValueInput from './networks/IdeaNetworkValueInput'
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
            <BeneficiaryField />
            <IdeaNetworkValueInput
                className={classes.inputField}
                inputName={'currentNetwork.value'}
                networkId={values.currentNetwork.name}
                value={values.currentNetwork.value}
            />
        </>
    )
}

export default FoldedIdeaFormFields

import React from 'react'
import { useTranslation } from 'react-i18next'
import ContactInput from '../../idea-proposal-details/form/ContactInput'
import ContentInput from '../../idea-proposal-details/form/ContentInput'
import FieldInput from '../../idea-proposal-details/form/FieldInput'
import LinkInput from '../../idea-proposal-details/form/LinksInput'
import PortfolioInput from '../../idea-proposal-details/form/PorfolioInput'
import TitleInput from '../../idea-proposal-details/form/TitleInput'
import BeneficiaryField from './fields/BeneficiaryField'
import NetworksInput from './networks/NetworksInput'
import { IdeaFormValues } from './useIdeaForm'

interface OwnProps {
    values: IdeaFormValues
}

export type IdeaFormFieldsProps = OwnProps

const IdeaFormFields = ({ values }: IdeaFormFieldsProps) => {
    const { t } = useTranslation()

    return (
        <>
            <TitleInput />
            <BeneficiaryField />
            <NetworksInput currentNetwork={values.currentNetwork} additionalNetworks={values.additionalNetworks} />
            <FieldInput placeholder={t('idea.details.field')} label={t('idea.details.field')} />
            <ContentInput placeholder={t('idea.details.content')} label={t('idea.details.content')} />

            <ContactInput />
            <PortfolioInput />
            <LinkInput links={values.links} />
        </>
    )
}

export default IdeaFormFields

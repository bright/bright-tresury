import React from 'react'
import { useTranslation } from 'react-i18next'
import StyledSmallInput from '../../components/form/input/StyledSmallInput'
import ContactInput from '../../idea-proposal-details/form/ContactInput'
import ContentInput from '../../idea-proposal-details/form/ContentInput'
import FieldInput from '../../idea-proposal-details/form/FieldInput'
import LinkInput from '../../idea-proposal-details/form/LinksInput'
import PortfolioInput from '../../idea-proposal-details/form/PorfolioInput'
import TitleInput from '../../idea-proposal-details/form/TitleInput'
import { IdeaFormValues } from './IdeaForm'
import NetworksInput from './networks/NetworksInput'

interface OwnProps {
    values: IdeaFormValues
}

export type IdeaFormFieldsProps = OwnProps

const IdeaFormFields = ({ values }: IdeaFormFieldsProps) => {
    const { t } = useTranslation()

    return (
        <>
            <TitleInput />
            <StyledSmallInput
                name="beneficiary"
                placeholder={t('idea.details.beneficiary')}
                label={t('idea.details.beneficiary')}
            />
            <NetworksInput currentNetwork={values.currentNetwork} otherNetworks={values.otherNetworks} />
            <FieldInput placeholder={t('idea.details.field')} label={t('idea.details.field')} />
            <ContentInput placeholder={t('idea.details.content')} label={t('idea.details.content')} />

            <ContactInput />
            <PortfolioInput />
            <LinkInput links={values.links} />
        </>
    )
}

export default IdeaFormFields

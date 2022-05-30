import React from 'react'
import { useTranslation } from 'react-i18next'
import Container from '../../../../components/form/Container'
import FormFooterButton from '../../../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../../../components/form/footer/FormFooterButtonsContainer'
import ChildBountyCreateForm from './ChildBountyCreateForm'
import { Redirect, useParams } from 'react-router-dom'
import { isNumber } from '../../../../util/numberUtil'
import { ROUTE_BOUNTIES } from '../../../../routes/routes'

const ChildBountyCreate = () => {
    const { t } = useTranslation()

    const { bountyIndex } = useParams<{ bountyIndex?: string }>()

    if (!isNumber(bountyIndex)) return <Redirect to={ROUTE_BOUNTIES} />

    return (
        <Container title={t('childBounty.create.title')} showWarningOnClose={true}>
            <ChildBountyCreateForm parentBountyBlockchainIndex={Number(bountyIndex)}>
                <FormFooterButtonsContainer>
                    <FormFooterButton type={'submit'}>{t('childBounty.create.submit')}</FormFooterButton>
                </FormFooterButtonsContainer>
            </ChildBountyCreateForm>
        </Container>
    )
}

export default ChildBountyCreate

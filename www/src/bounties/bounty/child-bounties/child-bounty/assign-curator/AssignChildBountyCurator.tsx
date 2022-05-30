import Container from '../../../../../components/form/Container'
import FormFooterButtonsContainer from '../../../../../components/form/footer/FormFooterButtonsContainer'
import FormFooterButton from '../../../../../components/form/footer/FormFooterButton'
import { useTranslation } from 'react-i18next'
import React from 'react'
import AssignChildBountyCuratorForm from './AssignChildBountyCuratorForm'
import { useParams } from 'react-router'
import { isNumber } from '../../../../../util/numberUtil'
import { generatePath, Redirect } from 'react-router-dom'
import { ROUTE_BOUNTIES, ROUTE_CHILD_BOUNTIES } from '../../../../../routes/routes'

const AssignChildBountyCurator = () => {
    const { t } = useTranslation()
    let { childBountyIndex } = useParams<{ childBountyIndex: string }>()
    let { bountyIndex } = useParams<{ bountyIndex: string }>()

    if (!isNumber(bountyIndex)) {
        return <Redirect to={ROUTE_BOUNTIES} />
    }
    if (!isNumber(childBountyIndex)) {
        return <Redirect to={generatePath(ROUTE_CHILD_BOUNTIES, { bountyIndex: bountyIndex })} />
    }

    return (
        <Container title={t('childBounty.assignCurator.title')}>
            <AssignChildBountyCuratorForm
                blockchainIndex={Number(childBountyIndex)}
                parentBountyBlockchainIndex={Number(bountyIndex)}
            >
                <FormFooterButtonsContainer>
                    <FormFooterButton type={'submit'} variant={'contained'}>
                        {t('childBounty.assignCurator.form.submit')}
                    </FormFooterButton>
                </FormFooterButtonsContainer>
            </AssignChildBountyCuratorForm>
        </Container>
    )
}

export default AssignChildBountyCurator

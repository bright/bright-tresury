import React from 'react'
import { useTranslation } from 'react-i18next'
import Container from '../../../../../../../components/form/Container'
import FormFooterButtonsContainer from '../../../../../../../components/form/footer/FormFooterButtonsContainer'
import FormFooterButton from '../../../../../../../components/form/footer/FormFooterButton'
import ChildBountyAwardForm from './form/ChildBountyAwardForm'
import { useParams } from 'react-router'
import { isNumber } from '../../../../../../../util/numberUtil'
import { generatePath, Redirect } from 'react-router-dom'
import { ROUTE_BOUNTIES, ROUTE_CHILD_BOUNTIES } from '../../../../../../../routes/routes'

const ChildBountyAward = () => {
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
        <Container title={t('childBounty.award.title')}>
            <ChildBountyAwardForm
                parentBountyBlockchainIndex={Number(bountyIndex)}
                blockchainIndex={Number(childBountyIndex)}
            >
                <FormFooterButtonsContainer>
                    <FormFooterButton type={'submit'} variant={'contained'}>
                        {t('childBounty.award.save')}
                    </FormFooterButton>
                </FormFooterButtonsContainer>
            </ChildBountyAwardForm>
        </Container>
    )
}
export default ChildBountyAward

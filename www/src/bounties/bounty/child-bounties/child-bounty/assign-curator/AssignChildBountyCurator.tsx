import { ChildBountyDto } from '../../child-bounties.dto'
import Container from '../../../../../components/form/Container'
import FormFooterButtonsContainer from '../../../../../components/form/footer/FormFooterButtonsContainer'
import FormFooterButton from '../../../../../components/form/footer/FormFooterButton'
import { useTranslation } from 'react-i18next'
import React from 'react'
import AssignChildBountyCuratorForm from './AssignChildBountyCuratorForm'

interface OwnProps {
    childBounty: ChildBountyDto
}
export type AssignChildBountyCuratorProps = OwnProps

const AssignChildBountyCurator = ({ childBounty }: AssignChildBountyCuratorProps) => {
    const { t } = useTranslation()
    console.log('redraw AssignChildBountyCurator')
    return (
        <Container title={t('childBounty.assignCurator.title')}>
            <AssignChildBountyCuratorForm childBounty={childBounty}>
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

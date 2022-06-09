import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { generatePath } from 'react-router-dom'
import { ChildBountyDto } from '../../child-bounties.dto'
import { PatchChildBountyParams, usePatchChildBounty } from '../../child-bounties.api'
import { useChildBounty } from '../../useChildBounty'
import { ROUTE_CHILD_BOUNTY } from '../../../../../routes/routes'
import Container from '../../../../../components/form/Container'
import FormFooterErrorBox from '../../../../../components/form/footer/FormFooterErrorBox'
import FormFooterButtonsContainer from '../../../../../components/form/footer/FormFooterButtonsContainer'
import FormFooterButton from '../../../../../components/form/footer/FormFooterButton'
import ChildBountyEditForm from './ChildBountyEditForm'
import { BountyDto } from '../../../../bounties.dto'

interface OwnProps {
    childBounty: ChildBountyDto
    bounty: BountyDto
}

export type ChildBountyEditProps = OwnProps

const ChildBountyEdit = ({ bounty, childBounty }: ChildBountyEditProps) => {
    const { t } = useTranslation()
    const history = useHistory()

    const { mutateAsync, isError, isLoading } = usePatchChildBounty()

    const { canEdit, hasDetails } = useChildBounty(bounty, childBounty)

    const submit = async (params: PatchChildBountyParams) => {
        await mutateAsync(params, {
            onSuccess: () => {
                history.push(
                    generatePath(ROUTE_CHILD_BOUNTY, {
                        bountyIndex: childBounty.parentBountyBlockchainIndex,
                        childBountyIndex: childBounty.blockchainIndex,
                    }),
                )
            },
        })
    }

    if (!canEdit) {
        return <Container error={t('childBounty.edit.cannotEditBounty')} />
    }

    return (
        <Container
            title={hasDetails ? t('childBounty.edit.titleEdit') : t('childBounty.edit.titleAddDetails')}
            showWarningOnClose={true}
        >
            <ChildBountyEditForm childBounty={childBounty} onSubmit={submit}>
                {isError ? <FormFooterErrorBox error={t('errors.somethingWentWrong')} /> : null}
                <FormFooterButtonsContainer>
                    <FormFooterButton type={'submit'} variant={'contained'} disabled={isLoading}>
                        {t('childBounty.edit.save')}
                    </FormFooterButton>
                </FormFooterButtonsContainer>
            </ChildBountyEditForm>
        </Container>
    )
}
export default ChildBountyEdit

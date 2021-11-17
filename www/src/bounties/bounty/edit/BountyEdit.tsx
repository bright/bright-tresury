import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { generatePath } from 'react-router-dom'
import Container from '../../../components/form/Container'
import FormFooterButton from '../../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../../components/form/footer/FormFooterButtonsContainer'
import FormFooterErrorBox from '../../../components/form/footer/FormFooterErrorBox'
import { useNetworks } from '../../../networks/useNetworks'
import { ROUTE_BOUNTY } from '../../../routes/routes'
import { usePatchBounty } from '../../bounties.api'
import { BountyDto, EditBountyDto } from '../../bounties.dto'
import { useBounty } from '../useBounty'
import BountyEditForm, { BountyEditFormValues } from './BountyEditForm'

interface OwnProps {
    bounty: BountyDto
}

export type BountyEditProps = OwnProps

const BountyEdit = ({ bounty }: BountyEditProps) => {
    const { t } = useTranslation()
    const history = useHistory()
    const { network } = useNetworks()

    const { mutateAsync, isError, isLoading } = usePatchBounty()

    const { canEdit } = useBounty(bounty)

    const submit = async (formBounty: BountyEditFormValues) => {
        const data: EditBountyDto = {
            ...formBounty,
            networkId: network.id,
        }
        await mutateAsync(data, {
            onSuccess: () => {
                history.push(generatePath(ROUTE_BOUNTY, { bountyIndex: bounty.blockchainIndex }))
            },
        })
    }

    if (!canEdit) {
        return <Container error={t('bounty.edit.cannotEditBounty')} />
    }

    return (
        <Container title={t('bounty.edit.title')}>
            <BountyEditForm bounty={bounty} onSubmit={submit}>
                {isError ? <FormFooterErrorBox error={t('errors.somethingWentWrong')} /> : null}
                <FormFooterButtonsContainer>
                    <FormFooterButton type={'submit'} variant={'contained'} disabled={isLoading}>
                        {t('bounty.edit.save')}
                    </FormFooterButton>
                </FormFooterButtonsContainer>
            </BountyEditForm>
        </Container>
    )
}
export default BountyEdit

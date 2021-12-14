import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { generatePath } from 'react-router-dom'
import Container from '../../../components/form/Container'
import FormFooterButton from '../../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../../components/form/footer/FormFooterButtonsContainer'
import FormFooterErrorBox from '../../../components/form/footer/FormFooterErrorBox'
import { ROUTE_BOUNTY } from '../../../routes/routes'
import { PatchBountyParams, usePatchBounty } from '../../bounties.api'
import { BountyDto } from '../../bounties.dto'
import { useBounty } from '../useBounty'
import BountyEditForm from './BountyEditForm'

interface OwnProps {
    bounty: BountyDto
}

export type BountyEditProps = OwnProps

const BountyEdit = ({ bounty }: BountyEditProps) => {
    const { t } = useTranslation()
    const history = useHistory()

    const { mutateAsync, isError, isLoading } = usePatchBounty()

    const { canEdit, hasDetails } = useBounty(bounty)

    const submit = async (params: PatchBountyParams) => {
        await mutateAsync(params, {
            onSuccess: () => {
                history.push(generatePath(ROUTE_BOUNTY, { bountyIndex: bounty.blockchainIndex }))
            },
        })
    }

    if (!canEdit) {
        return <Container error={t('bounty.edit.cannotEditBounty')} />
    }

    return (
        <Container title={hasDetails ? t('bounty.edit.titleEdit') : t('bounty.edit.titleAddDetails')}>
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

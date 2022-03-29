import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Container from '../../../../../components/form/Container'
import FormFooterButton from '../../../../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../../../../components/form/footer/FormFooterButtonsContainer'
import FormFooterErrorBox from '../../../../../components/form/footer/FormFooterErrorBox'
import { useModal } from '../../../../../components/modal/useModal'
import { PatchBountyParams, usePatchBounty } from '../../../../bounties.api'
import { BountyDto } from '../../../../bounties.dto'
import { useBounty } from '../../../useBounty'
import AwardModal from './AwardModal'
import BountyAwardForm from './form/BountyAwardForm'

interface OwnProps {
    bounty: BountyDto
}

export type BountyAwardProps = OwnProps

const BountyAward = ({ bounty }: BountyAwardProps) => {
    const { t } = useTranslation()
    const { mutateAsync, isError, isLoading } = usePatchBounty()
    const [beneficiary, setBeneficiary] = useState(bounty.beneficiary?.web3address)
    const { canAward, hasDetails } = useBounty(bounty)
    const { visible, open, close } = useModal()

    const submit = async (params: PatchBountyParams) => {
        if (hasDetails) {
            await mutateAsync(params, {})
        }
        setBeneficiary(params.data.beneficiary)
        open()
    }

    if (!canAward) {
        return <Container error={t('bounty.award.cannotEditBounty')} />
    }

    return (
        <Container title={t('bounty.award.title')}>
            <BountyAwardForm bounty={bounty} onSubmit={submit}>
                {isError ? <FormFooterErrorBox error={t('errors.somethingWentWrong')} /> : null}
                <FormFooterButtonsContainer>
                    <FormFooterButton type={'submit'} variant={'contained'} disabled={isLoading}>
                        {t('bounty.award.save')}
                    </FormFooterButton>
                </FormFooterButtonsContainer>
            </BountyAwardForm>
            {beneficiary ? (
                <AwardModal
                    open={visible}
                    onClose={close}
                    beneficiary={beneficiary}
                    blockchainIndex={bounty.blockchainIndex}
                />
            ) : null}
        </Container>
    )
}
export default BountyAward

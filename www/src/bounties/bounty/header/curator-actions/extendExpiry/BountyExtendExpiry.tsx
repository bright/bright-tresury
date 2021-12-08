import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Container from '../../../../../components/form/Container'
import FormFooterButton from '../../../../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../../../../components/form/footer/FormFooterButtonsContainer'
import FormFooterErrorBox from '../../../../../components/form/footer/FormFooterErrorBox'
import { useModal } from '../../../../../components/modal/useModal'
import { Nil } from '../../../../../util/types'
import { PatchBountyParams, usePatchBounty } from '../../../../bounties.api'
import { BountyDto } from '../../../../bounties.dto'
import { useBounty } from '../../../useBounty'
import ExtendExpiryModal from './ExtendExpiryModal'
import BountyExtendExpiryForm from './form/BountyExtendExpiryForm'

interface OwnProps {
    bounty: BountyDto
}

export type BountyExtendExpiryProps = OwnProps

const BountyExtendExpiry = ({ bounty }: BountyExtendExpiryProps) => {
    const { t } = useTranslation()
    const { mutateAsync, isError, isLoading } = usePatchBounty()
    const [remark, setRemark] = useState<Nil<string>>()
    const { canExtendExpiry, hasDetails } = useBounty(bounty)
    const { visible, open, close } = useModal()

    const submit = async (params: PatchBountyParams, remark: string) => {
        if (hasDetails) {
            await mutateAsync(params, {})
        }
        setRemark(remark)
        open()
    }

    if (!canExtendExpiry) {
        return <Container error={t('bounty.extendExpiry.cannotExtendExpiry')} />
    }

    return (
        <Container title={t('bounty.extendExpiry.title')}>
            <BountyExtendExpiryForm bounty={bounty} onSubmit={submit}>
                {isError ? <FormFooterErrorBox error={t('errors.somethingWentWrong')} /> : null}
                <FormFooterButtonsContainer>
                    <FormFooterButton type={'submit'} variant={'contained'} disabled={isLoading}>
                        {t('bounty.extendExpiry.save')}
                    </FormFooterButton>
                </FormFooterButtonsContainer>
            </BountyExtendExpiryForm>
            {remark ? (
                <ExtendExpiryModal
                    open={visible}
                    onClose={close}
                    remark={remark}
                    blockchainIndex={bounty.blockchainIndex}
                />
            ) : null}
        </Container>
    )
}
export default BountyExtendExpiry

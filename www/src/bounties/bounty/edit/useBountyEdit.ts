import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { useNetworks } from '../../../networks/useNetworks'
import { isValidAddressOrEmpty } from '../../../util/addressValidator'
import { PatchBountyParams } from '../../bounties.api'
import { BountyDto, EditBountyDto } from '../../bounties.dto'

export interface BountyEditFormValues {
    blockchainIndex: number
    title: string
    field: string
    description: string
    beneficiary: string
}

export interface UseBountyEditResult {
    initialValues: BountyEditFormValues
    validationSchema: any
    beneficiaryValidationSchema: any
    remarkValidationSchema: any
    patchParams: (formValues: BountyEditFormValues) => PatchBountyParams
}

export const useBountyEdit = (bounty: BountyDto): UseBountyEditResult => {
    const { network } = useNetworks()
    const { t } = useTranslation()

    const validationSchema = Yup.object({
        title: Yup.string().required(t('bounty.form.emptyFieldError')),
        beneficiary: Yup.string().test(
            'validate-address',
            t('form.web3AddressInput.wrongWeb3AddressError'),
            (address) => {
                return isValidAddressOrEmpty(address, network.ss58Format)
            },
        ),
    })

    const beneficiaryValidationSchema = Yup.object({
        beneficiary: Yup.string().required(t('bounty.form.emptyFieldError')),
    })

    const remarkValidationSchema = Yup.object({
        remark: Yup.string().required(t('bounty.form.emptyFieldError')),
    })

    const initialValues: BountyEditFormValues = {
        blockchainIndex: bounty.blockchainIndex,
        title: bounty.title ?? '',
        field: bounty.field ?? '',
        description: bounty.description ?? '',
        beneficiary: bounty.beneficiary?.web3address ?? '',
    }

    const patchParams = (formValues: BountyEditFormValues): PatchBountyParams => {
        const data: EditBountyDto = {
            ...formValues,
        }
        return { bountyIndex: formValues.blockchainIndex.toString(), network: network.id, data }
    }
    return {
        validationSchema,
        beneficiaryValidationSchema,
        remarkValidationSchema,
        initialValues,
        patchParams,
    }
}

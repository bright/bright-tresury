import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { ChildBountyDto, EditChildBountyDto } from '../../child-bounties.dto'
import { PatchChildBountyParams } from '../../child-bounties.api'
import { useNetworks } from '../../../../../networks/useNetworks'

export interface ChildBountyEditFormValues {
    title: string
    description: string
}

export interface UseChildBountyEditResult {
    initialValues: ChildBountyEditFormValues
    validationSchema: any
    patchParams: (formValues: ChildBountyEditFormValues) => PatchChildBountyParams
}

export const useChildBountyEdit = (childBounty: ChildBountyDto): UseChildBountyEditResult => {
    const { network } = useNetworks()
    const { t } = useTranslation()

    const validationSchema = Yup.object({
        title: Yup.string().required(t('childBounty.form.emptyFieldError')),
    })

    const initialValues: ChildBountyEditFormValues = {
        title: childBounty.title ?? '',
        description: childBounty.description ?? '',
    }

    const patchParams = (formValues: ChildBountyEditFormValues): PatchChildBountyParams => {
        return {
            bountyIndex: childBounty.parentBountyBlockchainIndex.toString(),
            childBountyIndex: childBounty.blockchainIndex.toString(),
            network: network.id,
            data: formValues,
        }
    }
    return {
        validationSchema,
        initialValues,
        patchParams,
    }
}

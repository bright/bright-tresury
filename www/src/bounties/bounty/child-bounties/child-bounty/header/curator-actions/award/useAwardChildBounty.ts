import * as Yup from 'yup'
import { useNetworks } from '../../../../../../../networks/useNetworks'
import { useTranslation } from 'react-i18next'
import { isValidAddress } from '../../../../../../../util/addressValidator'

export interface AwardChildBountyParams {
    beneficiary: string
}

export const useAwardChildBounty = ({
    parentBountyBlockchainIndex,
    blockchainIndex,
}: {
    blockchainIndex: number
    parentBountyBlockchainIndex: number
}) => {
    const { network } = useNetworks()
    const { t } = useTranslation()

    const validationSchema = Yup.object({
        beneficiary: Yup.string()
            .required(t('childBounty.form.emptyFieldError'))
            .test(
                'validate-address',
                t('form.web3AddressInput.wrongWeb3AddressError'),
                (address) => !!address && isValidAddress(address, network.ss58Format),
            ),
    })

    const initialValues = { beneficiary: '' }

    const toAwardChildBountyParams = (formValues: AwardChildBountyParams) => ({
        parentBountyBlockchainIndex,
        blockchainIndex,
        beneficiary: formValues.beneficiary,
    })

    return { validationSchema, initialValues, toAwardChildBountyParams }
}

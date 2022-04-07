import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { useNetworks } from 'networks/useNetworks'
import { isValidAddressOrEmpty } from 'util/addressValidator'

export interface TipCreateFormValues {
    blockchainDescription: string
    title: string
    description: string
    beneficiary: string
}

export interface UseTipCreateResult {
    initialValues: TipCreateFormValues
    validationSchema: any
}

export const useTipCreate = (): UseTipCreateResult => {
    const { network } = useNetworks()
    const { t } = useTranslation()

    const validationSchema = Yup.object({
        title: Yup.string().required(t('tip.form.emptyFieldError')),
        blockchainDescription: Yup.string().required(t('tip.form.emptyFieldError')),
        beneficiary: Yup.string()
            .required(t('tip.form.emptyFieldError'))
            .test('validate-address', t('form.web3AddressInput.wrongWeb3AddressError'), (address) => {
                return isValidAddressOrEmpty(address, network.ss58Format)
            }),
        // todo add validation for maximumReasonLength
        // .test(
        //     'max-bytes-length',
        //     t('tip.form.maxBlockchainDescriptionLength'),
        //     optional((value) => getBytesLength(value) <= network.tips.maximumReasonLength),
        // ),
    })

    const initialValues: TipCreateFormValues = {
        blockchainDescription: '',
        title: '',
        description: '',
        beneficiary: '',
    }

    return {
        validationSchema,
        initialValues,
    }
}

import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { useNetworks } from 'networks/useNetworks'
import { isValidAddressOrEmpty } from 'util/addressValidator'
import { networkValueValidationSchema, optional } from '../../components/form/input/networkValue/NetworkValueInput'
import { getBytesLength } from '../../util/stringUtil'
import { NetworkDisplayValue } from '../../util/types'

export interface TipCreateFormValues {
    blockchainReason: string
    title: string
    description: string
    beneficiary: string
    value: NetworkDisplayValue
}

export interface UseTipCreateResult {
    initialValues: TipCreateFormValues
    validationSchema: any
}

export const useTipCreate = (): UseTipCreateResult => {
    const { network, findNetwork } = useNetworks()
    const { t } = useTranslation()

    const validationSchema = Yup.object({
        title: Yup.string().required(t('tip.form.emptyFieldError')),
        blockchainReason: Yup.string()
            .required(t('tip.form.emptyFieldError'))
            .test(
                'max-bytes-length',
                t('tip.form.maxBlockchainReasonLength'),
                optional((value) => getBytesLength(value) <= network.tips.maximumReasonLength),
            ),
        beneficiary: Yup.string()
            .required(t('tip.form.emptyFieldError'))
            .test('validate-address', t('form.web3AddressInput.wrongWeb3AddressError'), (address) =>
                isValidAddressOrEmpty(address, network.ss58Format),
            ),
        value: networkValueValidationSchema({
            t,
            findNetwork,
            required: true,
            nonZero: false,
            decimals: network.decimals,
        }),
    })

    const initialValues: TipCreateFormValues = {
        blockchainReason: '',
        title: '',
        description: '',
        beneficiary: '',
        value: '0' as NetworkDisplayValue,
    }

    return {
        validationSchema,
        initialValues,
    }
}

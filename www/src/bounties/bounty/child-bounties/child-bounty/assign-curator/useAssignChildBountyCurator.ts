import { ChildBountyDto } from '../../child-bounties.dto'
import * as Yup from 'yup'
import { isValidAddress } from '../../../../../util/addressValidator'
import { networkValueValidationSchema } from '../../../../../components/form/input/networkValue/NetworkValueInput'
import { useNetworks } from '../../../../../networks/useNetworks'
import { useTranslation } from 'react-i18next'
import { NetworkDisplayValue, NetworkPlanckValue } from '../../../../../util/types'
import { toNetworkPlanckValue } from '../../../../../util/quota.util'

export interface AssignChildBountyCuratorFormValues {
    curator: string
    fee: NetworkDisplayValue
}

export const useAssignChildBountyCurator = ({
    parentBountyBlockchainIndex,
    blockchainIndex,
}: {
    blockchainIndex: number
    parentBountyBlockchainIndex: number
}) => {
    const { network, findNetwork } = useNetworks()
    const { t } = useTranslation()

    const validationSchema = Yup.object({
        curator: Yup.string()
            .required(t('childBounty.form.emptyFieldError'))
            .test(
                'validate-address',
                t('form.web3AddressInput.wrongWeb3AddressError'),
                (address) => !!address && isValidAddress(address, network.ss58Format),
            ),
        fee: networkValueValidationSchema({ t, findNetwork, decimals: network.decimals, required: true }),
    })

    const initialValues = { curator: '', fee: '0' as NetworkDisplayValue }

    const toAssignChildBountyCuratorParams = (formValues: AssignChildBountyCuratorFormValues) => ({
        parentBountyBlockchainIndex,
        blockchainIndex,
        curator: formValues.curator,
        fee: toNetworkPlanckValue(formValues.fee, network.decimals) ?? ('0' as NetworkPlanckValue),
    })

    return { validationSchema, initialValues, toAssignChildBountyCuratorParams }
}

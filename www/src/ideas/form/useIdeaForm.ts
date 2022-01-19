import { networkValueValidationSchema } from '../../components/form/input/networkValue/NetworkValueInput'
import { EditIdeaDto, EditIdeaNetworkDto, IdeaDto, IdeaNetworkDto } from '../ideas.dto'
import { toNetworkDisplayValue, toNetworkPlanckValue } from '../../util/quota.util'
import { useNetworks } from '../../networks/useNetworks'
import { NetworkDisplayValue, Nil } from '../../util/types'
import { formatAddress } from '../../components/identicon/utils'
import * as Yup from 'yup'
import { titleValidationSchema } from '../../idea-proposal-details/form/TitleInput'
import { linksValidationSchema } from '../../idea-proposal-details/form/LinksInput'
import { isValidAddressOrEmpty } from '../../util/addressValidator'
import { useTranslation } from 'react-i18next'

export interface IdeaFormValues {
    beneficiary: string
    currentNetwork: IdeaNetworkFromValues
    additionalNetworks: IdeaNetworkFromValues[]
    title: string
    field?: string
    content: string
    contact?: string
    portfolio?: string
    links?: string[]
}
export type IdeaNetworkFromValues = Omit<EditIdeaNetworkDto, 'value'> & { value: NetworkDisplayValue }

const useIdeaForm = () => {
    const { t } = useTranslation()
    const { network, findNetwork } = useNetworks()

    const validationSchema = Yup.object({
        title: titleValidationSchema(t),
        links: linksValidationSchema(t),
        beneficiary: Yup.string().test(
            'validate-address',
            t('form.web3AddressInput.wrongWeb3AddressError'),
            (address) => {
                return isValidAddressOrEmpty(address, network.ss58Format)
            },
        ),
        additionalNetworks: Yup.array().of(
            Yup.object().shape({
                value: networkValueValidationSchema({ t, findNetwork }),
            }),
        ),
        currentNetwork: Yup.object().shape({
            value: networkValueValidationSchema({ t, findNetwork }),
        }),
    })

    const extendedValidationSchema = Yup.object().shape({
        beneficiary: Yup.string().required(t('idea.details.form.emptyFieldError')),
        currentNetwork: Yup.object().shape({
            value: networkValueValidationSchema({ t, findNetwork, required: true }),
        }),
    })

    const toIdeaNetworkFromValues = (ideaNetwork: IdeaNetworkDto): IdeaNetworkFromValues => ({
        ...ideaNetwork,
        value: toNetworkDisplayValue(ideaNetwork.value, findNetwork(ideaNetwork.name)!.decimals),
    })
    const toEditIdeaNetworkDto = (formIdeaNetwork: IdeaNetworkFromValues): EditIdeaNetworkDto => ({
        ...formIdeaNetwork,
        value: toNetworkPlanckValue(formIdeaNetwork.value, findNetwork(formIdeaNetwork.name)!.decimals)!,
    })
    const toFormValues = (idea: Nil<IdeaDto>): IdeaFormValues => {
        if (!idea) {
            return {
                beneficiary: '',
                currentNetwork: { name: network.id, value: '0' as NetworkDisplayValue },
                additionalNetworks: [],
                title: '',
                field: '',
                content: '',
                portfolio: '',
                links: [''],
                contact: '',
            }
        }
        return {
            beneficiary: formatAddress(idea.beneficiary, network.ss58Format, false),
            currentNetwork: toIdeaNetworkFromValues(idea.currentNetwork),
            additionalNetworks: idea.additionalNetworks.map(toIdeaNetworkFromValues),
            ...idea.details,
            links: idea.details.links && idea.details.links.length > 0 ? idea.details.links : [''],
        }
    }
    const noEmptyLinks = (links: string[] | undefined) => links?.filter((link: string) => Boolean(link))
    const toEditIdeaDto = (values: IdeaFormValues): EditIdeaDto => ({
        beneficiary: values.beneficiary,
        additionalNetworks: values.additionalNetworks.map(toEditIdeaNetworkDto),
        currentNetwork: toEditIdeaNetworkDto(values.currentNetwork),
        details: {
            title: values.title,
            contact: values.contact,
            content: values.content,
            field: values.field,
            portfolio: values.portfolio,
            links: noEmptyLinks(values.links),
        },
    })
    return {
        validationSchema,
        extendedValidationSchema,
        toFormValues,
        toEditIdeaDto,
    }
}

export default useIdeaForm

import LoadingWrapper from '../../../components/loading/LoadingWrapper'
import { useGetChildBounties } from './child-bounties.api'
import { useNetworks } from '../../../networks/useNetworks'
import { useTranslation } from 'react-i18next'
import ChildBounties from './ChildBounties'
import { BountyDto } from '../../bounties.dto'

interface OwnProps {
    bounty: BountyDto
}
export type ChildBountiesLoaderProps = OwnProps
const ChildBountiesLoader = ({ bounty }: ChildBountiesLoaderProps) => {
    const { t } = useTranslation()
    const { network } = useNetworks()
    const { data, status } = useGetChildBounties({
        bountyIndex: bounty.blockchainIndex.toString(),
        network: network.id,
    })
    return (
        <LoadingWrapper
            list
            status={status}
            errorText={t('errors.errorOccurredWhileLoadingChildBounties')}
            loadingText={t('loading.childBounties')}
        >
            <ChildBounties bounty={bounty} childBounties={data ?? []} />
        </LoadingWrapper>
    )
}

export default ChildBountiesLoader

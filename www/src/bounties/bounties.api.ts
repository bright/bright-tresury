import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import { apiGet, apiPatch, apiPost } from '../api'
import { NetworkPlanckValue } from '../util/types'
import { BountyDto, BountyExtrinsicDto, BountyStatus, CreateBountyDto, EditBountyDto } from './bounties.dto'

export const BOUNTIES_API_PATH = '/bounties'

// GET ONE

async function getBounty(bountyIndex: string, network: string): Promise<BountyDto> {
    // foreign bounty
    // return Promise.resolve({
    //     blockchainIndex: 0,
    //     blockchainSubject: 'on chain',
    //     value: '1000000000000' as NetworkPlanckValue,
    //     deposit: '10800000000' as NetworkPlanckValue,
    //     curatorDeposit: '123000000000' as NetworkPlanckValue,
    //     proposer: { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' },
    //     status: BountyStatus.PendingPayout,
    //     curatorsFee: '500000000000' as NetworkPlanckValue,
    //     curator: { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' },
    //     updateDue: '2022-03-09',
    //     beneficiary: { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' },
    //     unlockDate: '2022-03-09',
    // })
    return Promise.resolve({
        id: 'f695f755-0584-40fb-bb45-804153427d2e',
        blockchainIndex: 2,
        blockchainDescription: 'This title is stored on chain',
        value: '1000000000000' as NetworkPlanckValue,
        deposit: '10800000000' as NetworkPlanckValue,
        curatorDeposit: '0' as NetworkPlanckValue,
        title: 'Some bounty',
        field: 'Optimisation',
        description:
            'We urgently need to build a website for lore ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo.',
        proposer: { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' },
        status: BountyStatus.CuratorProposed,
        curatorsFee: '500000000000' as NetworkPlanckValue,
        curator: { address: '5FfBQ3kwXrbdyoqLPvcXRp7ikWydXawpNs2Ceu3WwFdhZ8W4' },
        updateDue: { days: 1, hours: 1, minutes: 1, seconds: 1, milliseconds: 1 },
        beneficiary: { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' },
        unlockAt: { days: 1, hours: 1, minutes: 1, seconds: 1, milliseconds: 1 },
    })
    // return apiGet<BountyDto>(`${BOUNTIES_API_PATH}/${bountyIndex}?network=${network}`)
}

export const BOUNTY_QUERY_KEY_BASE = 'bounty'

export const useGetBounty = (
    { bountyIndex, network }: { bountyIndex: string; network: string },
    options?: UseQueryOptions<BountyDto>,
) => {
    return useQuery([BOUNTY_QUERY_KEY_BASE, bountyIndex, network], () => getBounty(bountyIndex, network), options)
}

// POST

async function createBounty(data: CreateBountyDto): Promise<BountyExtrinsicDto> {
    return apiPost(`${BOUNTIES_API_PATH}`, data)
}

export const useCreateBounty = () => {
    return useMutation(createBounty)
}

// PATCH

async function patchBounty(data: EditBountyDto): Promise<BountyDto> {
    return apiPatch<BountyDto>(`${BOUNTIES_API_PATH}/${data.blockchainIndex}`, data)
}

export const usePatchBounty = () => {
    return useMutation(patchBounty)
}

// GET ALL

async function getBounties(network: string): Promise<BountyDto[]> {
    // const bounties = await apiGet<BountyDto[]>(`${BOUNTIES_API_PATH}?network=${network}`)
    return Promise.resolve(
        [
            {
                id: 'f695f755-0584-40fb-bb45-804153427d2e',
                blockchainIndex: 0,
                blockchainDescription: 'This title is stored on chain',
                value: '1000000000000' as NetworkPlanckValue,
                deposit: '10800000000' as NetworkPlanckValue,
                curatorDeposit: '0' as NetworkPlanckValue,
                title: 'Some bounty',
                field: 'Optimisation',
                description:
                    'We urgently need to build a website for lore ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo.',
                proposer: { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' },
                status: BountyStatus.CuratorProposed,
                curatorsFee: '500000000000' as NetworkPlanckValue,
                curator: { address: '167yVg8vn9QGQM4zX8jPJHKBBYiBtMYUXqkN3e3HEV5nAWeV' },
                updateDue: { days: 1, hours: 1, minutes: 1, seconds: 1, milliseconds: 1 },
                beneficiary: { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' },
                unlockAt: { days: 1, hours: 1, minutes: 1, seconds: 1, milliseconds: 1 },
            },
            {
                id: 'f695f755-0584-40fb-bb45-804153427d2e',
                blockchainIndex: 0,
                blockchainDescription: 'This title is stored on chain',
                value: '1066000000000' as NetworkPlanckValue,
                deposit: '10800000000' as NetworkPlanckValue,
                curatorDeposit: '0' as NetworkPlanckValue,
                title: 'Some bounty',
                field: 'Optimisation',
                description:
                    'We urgently need to build a website for lore ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo.',
                proposer: { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' },
                status: BountyStatus.CuratorProposed,
                curatorsFee: '500000000000' as NetworkPlanckValue,
                curator: { address: '167yVg8vn9QGQM4zX8jPJHKBBYiBtMYUXqkN3e3HEV5nAWeV' },
                updateDue: { days: 1, hours: 1, minutes: 1, seconds: 1, milliseconds: 1 },
                beneficiary: { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' },
                unlockAt: { days: 1, hours: 1, minutes: 1, seconds: 1, milliseconds: 1 },
            },
        ],
        // {
        //     blockchainIndex: 0,
        //     blockchainSubject: 'on chain',
        //     value: '1000000000000' as NetworkPlanckValue,
        //     deposit: '10800000000' as NetworkPlanckValue,
        //     curatorDeposit: '123000000000' as NetworkPlanckValue,
        //     proposer: { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' },
        //     status: BountyStatus.PendingPayout,
        //     curatorsFee: '500000000000' as NetworkPlanckValue,
        //     curator: { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' },
        //     updateDue: '2022-03-09',
        //     beneficiary: { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' },
        //     unlockDate: '2022-03-09',
        // }
    )
}

export const BOUNTIES_QUERY_KEY_BASE = 'bounties'

export const useGetBounties = (network: string, options?: UseQueryOptions<BountyDto[]>) => {
    return useQuery([BOUNTIES_QUERY_KEY_BASE, network], () => getBounties(network))
}

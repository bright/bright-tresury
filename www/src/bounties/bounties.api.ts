import { useMutation } from 'react-query'
import { apiPost } from '../api'
import { BountyDto, BountyExtrinsicDto, CreateBountyDto } from './bounties.dto'

export const BOUNTIES_API_PATH = '/bounties'

// POST

async function createBounty(data: CreateBountyDto): Promise<BountyExtrinsicDto> {
    return apiPost(`${BOUNTIES_API_PATH}`, data)
}

export const useCreateBounty = () => {
    return useMutation(createBounty)
}

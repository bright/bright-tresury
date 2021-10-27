import { useMutation } from 'react-query'
import { apiPost } from '../api'
import { BountyDto, CreateBountyDto } from './bounties.dto'

export const BOUNTIES_API_PATH = '/bounties'

// POST

async function createBounty(data: CreateBountyDto) {
    // return apiPost<BountyDto>(`${BOUNTIES_API_PATH}`, data)
}

export const useCreateBounty = () => {
    return useMutation(createBounty)
}

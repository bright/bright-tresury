import { useInfiniteQuery, useMutation, useQuery, UseQueryOptions } from 'react-query'
import { PaginationRequestParams } from '../util/pagination/pagination.request.params'
import { TimeFrame } from '../util/useTimeFrame'
import { apiGet, apiPost, getUrlSearchParams } from '../api'
import { PaginationResponseDto } from '../util/pagination/pagination.response.dto'
import { CreateTipDto, TipDto, TipExtrinsicDto, TipStatus } from './tips.dto'
import { Nil } from '../util/types'

const TIPS_API_PATH = '/tips'
const TIPS_QUERY_KEY_BASE = 'tips'

interface GetTipsApiParams {
    network: string
    ownerId: Nil<string>
    status: Nil<TipStatus>
    timeFrame: TimeFrame
}

// GET

const getTips = async (params: GetTipsApiParams & PaginationRequestParams) => {
    return apiGet<PaginationResponseDto<TipDto>>(`${TIPS_API_PATH}?${getUrlSearchParams(params).toString()}`)
}
export const useGetTips = ({ pageNumber, ...params }: GetTipsApiParams & PaginationRequestParams) =>
    useInfiniteQuery(
        [TIPS_QUERY_KEY_BASE, params.network, params.timeFrame, params.ownerId, params.status],
        ({ pageParam: pageNumber }) => getTips({ pageNumber, ...params }),
        {
            getNextPageParam: (lastPage, allPages) => allPages.length + 1,
        },
    )

// GET ONE TIP

async function getTip(tipHash: string, network: string): Promise<TipDto> {
    return apiGet<TipDto>(`${TIPS_API_PATH}/${tipHash}?${getUrlSearchParams({ network }).toString()}`)
}

export const TIP_QUERY_KEY_BASE = 'tip'

export const useGetTip = (
    { tipHash, network }: { tipHash: string; network: string },
    options?: UseQueryOptions<TipDto>,
) => {
    return useQuery([TIP_QUERY_KEY_BASE, tipHash, network], () => getTip(tipHash, network), options)
}

// POST

async function createTip(data: CreateTipDto): Promise<TipExtrinsicDto> {
    return apiPost(`${TIPS_API_PATH}`, data)
}

export const useCreateTip = () => {
    return useMutation(createTip)
}

import { useInfiniteQuery, useMutation } from 'react-query'
import { PaginationRequestParams } from '../util/pagination/pagination.request.params'
import { TimeFrame } from '../util/useTimeFrame'
import { apiGet, apiPost, getUrlSearchParams } from '../api'
import { PaginationResponseDto } from '../util/pagination/pagination.response.dto'
import { CreateTipDto, TipDto, TipExtrinsicDto } from './tips.dto'

const TIPS_API_PATH = '/tips'
const TIPS_QUERY_KEY_BASE = 'tips'

interface GetTipsApiParams {
    network: string
    timeFrame: TimeFrame
}

// GET

const getTips = async (params: GetTipsApiParams & PaginationRequestParams) => {
    return apiGet<PaginationResponseDto<TipDto>>(`${TIPS_API_PATH}?${getUrlSearchParams(params).toString()}`)
}
export const useGetTips = ({ pageNumber, ...params }: GetTipsApiParams & PaginationRequestParams) =>
    useInfiniteQuery(
        [TIPS_QUERY_KEY_BASE, params.network, params.timeFrame],
        ({ pageParam: pageNumber }) => getTips({ pageNumber, ...params }),
        {
            getNextPageParam: (lastPage, allPages) => allPages.length + 1,
        },
    )

// POST

async function createTip(data: CreateTipDto): Promise<TipExtrinsicDto> {
    return apiPost(`${TIPS_API_PATH}`, data)
}

export const useCreateTip = () => {
    return useMutation(createTip)
}

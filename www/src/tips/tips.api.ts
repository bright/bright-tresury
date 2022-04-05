import { useInfiniteQuery } from 'react-query'
import { PaginationRequestParams } from '../util/pagination/pagination.request.params'
import { TimeFrame } from '../util/useTimeFrame'
import { apiGet, getUrlSearchParams } from '../api'
import { PaginationResponseDto } from '../util/pagination/pagination.response.dto'
import { TipDto } from './tip.dto'

const TIPS_API_PATH = '/tips'
const TIPS_QUERY_KEY_BASE = 'tips'

interface GetTipsApiParams {
    network: string
    timeFrame: TimeFrame
}

const getTips = async (params: GetTipsApiParams & PaginationRequestParams) => {
    return apiGet<PaginationResponseDto<TipDto>>(`${TIPS_API_PATH}?${getUrlSearchParams(params).toString()}`)
}
export const useGetTips = ({ pageNumber, ...params }: GetTipsApiParams & PaginationRequestParams) =>
    useInfiniteQuery([TIPS_QUERY_KEY_BASE, params], ({ pageParam: pageNumber }) => getTips({ pageNumber, ...params }), {
        getNextPageParam: (lastPage, allPages) => allPages.length + 1,
    })

import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import { apiGet, apiPatch, getUrlSearchParams } from '../../../api'
import { PaginationRequestParams } from '../../../util/pagination/pagination.request.params'
import { PaginationResponseDto } from '../../../util/pagination/pagination.response.dto'
import { AppEventDto, AppEventType } from './app-events.dto'

const appEventsApiPath = (userId: string) => `/users/${userId}/app-events`

// GET ALL

export const APP_EVENTS_QUERY_KEY_BASE = 'app_events'

interface GetAppEventsApiParams {
    userId: string
    isRead?: boolean
    appEventType?: AppEventType[]
    ideaId?: string
    proposalIndex?: number
    networkId?: string
}

function getAppEvents({ userId, ...params }: GetAppEventsApiParams & PaginationRequestParams) {
    let url = `${appEventsApiPath(userId)}?${getUrlSearchParams(params).toString()}`
    return apiGet<PaginationResponseDto<AppEventDto>>(url)
}

export const useGetAppEvents = (
    params: GetAppEventsApiParams & PaginationRequestParams,
    options?: UseQueryOptions<PaginationResponseDto<AppEventDto>>,
) => {
    return useQuery([APP_EVENTS_QUERY_KEY_BASE, params], () => getAppEvents(params), options)
}

export const UNREAD_APP_EVENTS_QUERY_KEY_BASE = 'unread_app_events'
export const useGetUnreadAppEvents = (
    params: { userId: string } & PaginationRequestParams,
    options?: UseQueryOptions<PaginationResponseDto<AppEventDto>>,
) => {
    return useQuery([UNREAD_APP_EVENTS_QUERY_KEY_BASE], () => getAppEvents({ ...params, isRead: false }), options)
}

export const IDEA_DISCUSSION_APP_EVENTS_QUERY_KEY_BASE = 'idea_discussion_app_events'
export const useGetIdeaDiscussionAppEvents = (
    params: { userId: string; ideaId: string } & PaginationRequestParams,
    options?: UseQueryOptions<PaginationResponseDto<AppEventDto>>,
) => {
    return useQuery(
        [IDEA_DISCUSSION_APP_EVENTS_QUERY_KEY_BASE],
        () =>
            getAppEvents({
                ...params,
                appEventType: [AppEventType.NewIdeaComment, AppEventType.TaggedInIdeaComment],
                isRead: false,
            }),
        options,
    )
}

export const PROPOSAL_DISCUSSION_APP_EVENTS_QUERY_KEY_BASE = 'proposal_discussion_app_events'
export const useGetProposalDiscussionAppEvents = (
    params: { userId: string; proposalIndex: number; networkId: string } & PaginationRequestParams,
    options?: UseQueryOptions<PaginationResponseDto<AppEventDto>>,
) => {
    return useQuery(
        [PROPOSAL_DISCUSSION_APP_EVENTS_QUERY_KEY_BASE],
        () =>
            getAppEvents({
                ...params,
                appEventType: [AppEventType.NewProposalComment, AppEventType.TaggedInProposalComment],
                isRead: false,
            }),
        options,
    )
}

export const BOUNTY_DISCUSSION_APP_EVENTS_QUERY_KEY_BASE = 'bounty_discussion_app_events'
export const useGetBountyDiscussionAppEvents = (
    params: { userId: string; bountyIndex: number; networkId: string } & PaginationRequestParams,
    options?: UseQueryOptions<PaginationResponseDto<AppEventDto>>,
) => {
    return useQuery(
        [BOUNTY_DISCUSSION_APP_EVENTS_QUERY_KEY_BASE],
        () =>
            getAppEvents({
                ...params,
                appEventType: [AppEventType.NewBountyComment, AppEventType.TaggedInBountyComment],
                isRead: false,
            }),
        options,
    )
}

// PATCH

export interface ReadAppEventsApiParams {
    userId: string
    appEventIds: string[]
}

function readAppEvent({ userId, appEventIds }: ReadAppEventsApiParams) {
    return apiPatch(`${appEventsApiPath(userId)}/read`, { appEventIds })
}

export const useReadAppEvents = () => {
    return useMutation(readAppEvent)
}

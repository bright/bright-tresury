export interface PaginationRequestParams {
    pageNumber?: number
    pageSize?: number
}

export function getPaginationQueryParams({ pageNumber, pageSize }: PaginationRequestParams) {
    const pageNumberQuery = pageNumber !== undefined ? `&pageNumber=${pageNumber}` : ''
    const pageSizeQuery = pageSize !== undefined ? `&pageSize=${pageSize}` : ''
    return `${pageNumberQuery}${pageSizeQuery}`
}

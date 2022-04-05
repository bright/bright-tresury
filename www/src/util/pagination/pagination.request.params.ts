export interface PaginationRequestParams {
    pageNumber: number
    pageSize: number
}
export const defaultPaginatedRequestParams = () => ({ pageNumber: 1, pageSize: 10 })

import { QueryStatus } from 'react-query'

export const reduceStatusList = (statusList: QueryStatus[]): QueryStatus => {
    if (statusList.includes('error')) return 'error'
    if (statusList.includes('idle')) return 'idle'
    if (statusList.includes('loading')) return 'loading'
    return 'success'
}

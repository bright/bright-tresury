export interface PostSchema<T> {
    id: number
    title: string
    content: string
    onchain_link: T
}

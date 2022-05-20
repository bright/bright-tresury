export interface ExtrinsicEvent {
    section: string
    method: string
    data: { name: string; value: string }[]
}

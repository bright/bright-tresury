interface OwnProps {
    parentIndex: number
    childBountyIndex: number
}

export type childBountyOrdinalNumber = OwnProps

export const childBountyOrdinalNumber = ({ parentIndex, childBountyIndex }: childBountyOrdinalNumber) => {
    return `${parentIndex}\xa0-\xa0${childBountyIndex}`
}

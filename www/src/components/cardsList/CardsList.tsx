import Grid from '../grid/Grid'

interface OwnProps<T> {
    items?: T[]
    sortFunction?: (a: T, b: T) => number
    renderCard: (item: T) => JSX.Element
}

export type CardsListProps<T> = OwnProps<T>

const CardsList = <T,>({ items, sortFunction, renderCard }: CardsListProps<T>) => {
    return <Grid items={sortFunction ? items?.sort(sortFunction) : items} renderItem={renderCard} />
}
export default CardsList

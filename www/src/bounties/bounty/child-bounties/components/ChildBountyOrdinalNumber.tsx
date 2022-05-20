import React from 'react'
import OrdinalNumber from '../../../../components/ordinalNumber/OrdinalNumber'

interface OwnProps {
    parentIndex: number
    childBountyIndex: number
}

export type ChildBountyOrdinalNumberProps = OwnProps

const ChildBountyOrdinalNumber = ({ parentIndex, childBountyIndex }: ChildBountyOrdinalNumberProps) => {
    return <OrdinalNumber prefix={`#\xa0`} ordinalNumber={`${parentIndex}\xa0-\xa0${childBountyIndex}`} />
}

export default ChildBountyOrdinalNumber

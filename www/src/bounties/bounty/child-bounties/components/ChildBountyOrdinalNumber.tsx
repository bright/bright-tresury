import React from 'react'
import OrdinalNumber from '../../../../components/ordinalNumber/OrdinalNumber'
import { childBountyOrdinalNumber } from '../../../../util/childBountyOrdinalNumberUtil'

interface OwnProps {
    parentIndex: number
    childBountyIndex: number
}

export type ChildBountyOrdinalNumberProps = OwnProps

const ChildBountyOrdinalNumber = ({ parentIndex, childBountyIndex }: ChildBountyOrdinalNumberProps) => {
    const ordinalChildBountyNumber = childBountyOrdinalNumber({ parentIndex, childBountyIndex })
    return <OrdinalNumber prefix={`#\xa0`} ordinalNumber={ordinalChildBountyNumber} />
}

export default ChildBountyOrdinalNumber

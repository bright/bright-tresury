import Divider from 'components/divider/Divider'
import React from 'react'
import { PublicUserDto } from '../../../../util/publicUser.dto'
import { TipDto } from '../../../tips.dto'
import Tipping from './Tipping'

interface OwnProps {
    tip: TipDto
    tippers: PublicUserDto[]
}

export type PendingTippersProps = OwnProps

const PendingTippers = ({ tip, tippers }: PendingTippersProps) => {
    const pendingTippers = tippers.filter(
        (tipper) => !tip.tips.find((tip) => tip.tipper.web3address === tipper.web3address),
    )

    return (
        <>
            <Divider />
            {pendingTippers.map((tipper) => (
                <Tipping key={tipper.web3address} tipping={{ tipper }} />
            ))}
        </>
    )
}
export default PendingTippers

import React from 'react'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'
import { TipDto } from '../../tips.dto'
import TippersCard from './card/TippersCard'
import NoTippers from './NoTippers'

interface OwnProps {
    tip: TipDto
}

export type TippersProps = OwnProps

const Tippers = ({ tip }: TippersProps) => {
    const classes = useSuccessfullyLoadedItemStyles()

    if (!tip.tips || tip.tips.length === 0) {
        return <NoTippers tipHash={tip.hash} />
    }

    return (
        <div className={classes.content}>
            <TippersCard tip={{ ...tip, tips: tip.tips }} />
        </div>
    )
}

export default Tippers

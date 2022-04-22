import { TipDto } from '../../tips.dto'
import { useMenu } from '../../../hook/useMenu'
import OptionsButton from '../../../components/header/details/OptionsButton'
import React from 'react'
import { ClassNameProps } from '../../../components/props/className.props'
import TipPayoutMenuItem from './TipPayoutMenuItem'
import TipCancelMenuItem from './TipCancelMenuItem'

interface OwnProps {
    tip: TipDto
}

export type TipOptionsButtonProps = OwnProps & ClassNameProps

const TipOptionsButton = ({ tip, className }: TipOptionsButtonProps) => {
    const { anchorEl, open, handleClose, handleOpen } = useMenu()

    return (
        <>
            <OptionsButton
                anchorEl={anchorEl}
                open={open}
                handleClose={handleClose}
                handleOpen={handleOpen}
                className={className}
            >
                <TipCancelMenuItem tip={tip} />
                <TipPayoutMenuItem tip={tip} />
            </OptionsButton>
        </>
    )
}
export default TipOptionsButton

import { TipDto } from '../../tips.dto'
import { useTranslation } from 'react-i18next'
import { useMenu } from '../../../hook/useMenu'
import OptionsButton from '../../../components/header/details/OptionsButton'
import { useModal } from '../../../components/modal/useModal'
import React from 'react'
import { ClassNameProps } from '../../../components/props/className.props'

import TipPayoutMenuItem from './TipPayoutMenuItem'
import TipPayoutModal from './TipPayoutModal'

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
                <TipPayoutMenuItem tip={tip} />
            </OptionsButton>
        </>
    )
}
export default TipOptionsButton

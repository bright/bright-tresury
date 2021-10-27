import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import Button from '../components/button/Button'
import HeaderListContainer from '../components/header/list/HeaderListContainer'
import { ROUTE_NEW_BOUNTY } from '../routes/routes'

interface OwnProps {}

export type BountiesHeaderProps = OwnProps

const BountiesHeader = ({}: BountiesHeaderProps) => {
    const { t } = useTranslation()
    const history = useHistory()

    const goToNewBounty = () => {
        history.push(ROUTE_NEW_BOUNTY)
    }

    return (
        <HeaderListContainer>
            <Button variant="contained" color="primary" onClick={goToNewBounty}>
                {t('bounty.list.createBounty')}
            </Button>
        </HeaderListContainer>
    )
}

export default BountiesHeader

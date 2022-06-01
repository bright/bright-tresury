import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import ChildBountiesList from './list/ChildBountiesList'
import { BountyDto } from '../../bounties.dto'
import { useBounty } from '../useBounty'
import AddChildBountyLink from './components/AddChildBountyLink'
import { useTranslation } from 'react-i18next'
import { ChildBountyDto } from './child-bounties.dto'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
        },
        noChildBounties: {
            marginLeft: '32px',
        },
    }),
)

export enum ChildBountyContentType {
    Info = 'info',
}

interface OwnProps {
    bounty: BountyDto
    childBounties: ChildBountyDto[]
}

export type ChildBountiesProps = OwnProps

const ChildBounties = ({ bounty, childBounties }: ChildBountiesProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { isActive, isCurator, hasChildBounties } = useBounty(bounty)
    return (
        <div className={classes.root}>
            {isCurator && isActive ? <AddChildBountyLink bounty={bounty} /> : null}
            {!hasChildBounties ? (
                <p className={classes.noChildBounties}>{t('childBounty.list.noChildBounties')}</p>
            ) : null}
            {hasChildBounties ? (
                <ChildBountiesList bounty={bounty} childBounties={childBounties}></ChildBountiesList>
            ) : null}
        </div>
    )
}

export default ChildBounties

import React, { useMemo } from 'react'
import NormalRouterLink from '../../components/link/NormalRouterLink'
import child_bounties from '../../assets/child_bounties.svg'
import { generatePath } from 'react-router-dom'
import { ROUTE_BOUNTY } from '../../routes/routes'
import { BountyContentType } from '../bounty/Bounty'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        childBounty: {
            color: theme.palette.primary.main,
            fontWeight: 600,
            borderRadius: '8px',
            textDecoration: 'none',
            justifySelf: 'start',
        },
        childBountyContainer: {
            display: 'flex',
            width: '100%',
            wrap: 'nowrap',
            whiteSpace: 'nowrap',
        },
        childBountyArrow: {
            position: 'relative',
            top: '1px',
            marginRight: '3px',
            marginLeft: '10px',
        },
    }),
)

interface OwnProps {
    bountyIndex: number
    childBountiesCount: number
}

export type ChildBountyStatusIndicatorProps = OwnProps

const ChildBountiesLink = ({ bountyIndex, childBountiesCount }: ChildBountyStatusIndicatorProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const redirectToChildBounties = `${generatePath(ROUTE_BOUNTY, { bountyIndex })}/${BountyContentType.ChildBounties}`

    const label = useMemo(
        () =>
            childBountiesCount === 1
                ? t('bounty.list.childBounties.childBounty')
                : t('bounty.list.childBounties.childBounties'),
        [childBountiesCount],
    )

    return (
        <div className={classes.childBountyContainer}>
            <NormalRouterLink className={classes.childBounty} to={redirectToChildBounties}>
                <img className={classes.childBountyArrow} alt={'Child-bounty icon'} src={child_bounties} />
                {`${childBountiesCount}  ${label}`}
            </NormalRouterLink>
        </div>
    )
}

export default ChildBountiesLink

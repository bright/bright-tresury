import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import ChildBountiesList from './list/ChildBountiesList'
import { BountyDto } from '../../bounties.dto'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
        },
    }),
)

export enum ChildBountyContentType {
    Info = 'info',
}

interface OwnProps {
    bounty: BountyDto
}

export type ChildBountiesProps = OwnProps

const ChildBounties = ({ bounty }: ChildBountiesProps) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <ChildBountiesList bounty={bounty}></ChildBountiesList>
        </div>
    )
}

export default ChildBounties

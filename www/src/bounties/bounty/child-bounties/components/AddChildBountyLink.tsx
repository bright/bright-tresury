import React, { useCallback } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import { ROUTE_NEW_CHILD_BOUNTY } from '../../../../routes/routes'
import { BountyDto } from '../../../bounties.dto'
import { breakpoints } from '../../../../theme/theme'
import { mobileHeaderListHorizontalMargin } from '../../../../components/header/list/HeaderListContainer'
import Button from '../../../../components/button/Button'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            marginLeft: '32px',
            marginTop: '26px',
            fontWeight: 700,
            [theme.breakpoints.down(breakpoints.mobile)]: {
                fontSize: '15px',
                margin: `0px ${mobileHeaderListHorizontalMargin}`,
                flex: 1,
            },
        },
    }),
)

interface OwnProps {
    bounty: BountyDto
}

export type AddChildBountyLinkProps = OwnProps

const AddChildBountyLink = ({ bounty }: AddChildBountyLinkProps) => {
    const classes = useStyles()
    const history = useHistory()
    const { t } = useTranslation()

    const onClick = useCallback(
        () => history.push(generatePath(ROUTE_NEW_CHILD_BOUNTY, { bountyIndex: bounty.blockchainIndex })),
        [bounty],
    )
    return (
        <Button variant="text" color="primary" className={classes.button} onClick={onClick}>
            {t('childBounty.list.create')}
        </Button>
    )
}

export default AddChildBountyLink

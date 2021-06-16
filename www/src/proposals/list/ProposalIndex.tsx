import React from 'react'
import { Trans } from 'react-i18next'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Strong from '../../components/strong/Strong'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            fontSize: 16,
            color: theme.palette.text.disabled,
        },
    }),
)

interface OwnProps {
    proposalIndex: number
}

export type ProposalIndexProps = OwnProps

const ProposalIndex = ({ proposalIndex }: ProposalIndexProps) => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Trans
                i18nKey="proposal.list.card.proposalIndex"
                values={{ proposalIndex: proposalIndex }}
                components={{
                    strong: <Strong />,
                }}
            />
        </div>
    )
}

export default ProposalIndex

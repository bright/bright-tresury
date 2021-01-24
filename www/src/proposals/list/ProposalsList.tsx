import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../../theme/theme";
import Grid from "@material-ui/core/Grid";
import ProposalCard from "./ProposalCard";
import {ProposalDto} from "../proposals.api";
import {proposalsHorizontalMargin, proposalsMobileHorizontalMargin} from "../Proposals";

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        tilesContainer: {
            padding: `26px ${proposalsHorizontalMargin}`,
            backgroundColor: theme.palette.background.paper,
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: `8px ${proposalsMobileHorizontalMargin} 26px ${proposalsMobileHorizontalMargin}`,
            },
        },
    })
})

interface Props {
    proposals: ProposalDto[]
}

const ProposalList: React.FC<Props> = ({proposals}) => {
    const classes = useStyles()

    return <div className={classes.tilesContainer}>
        <Grid container spacing={2}>
            {proposals.map((proposal) =>
                <Grid key={proposal.proposalIndex} item xs={12} md={6}>
                    <ProposalCard proposal={proposal}/>
                </Grid>
            )}
        </Grid>
    </div>
}

export default ProposalList

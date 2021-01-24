import React from 'react';
import ProposalsHeader from "./ProposalsHeader";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

export const proposalsHorizontalMargin = '32px'
export const proposalsMobileHorizontalMargin = '18px'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%'
        }
    }))

const Proposals: React.FC = () => {
    const classes = useStyles()
    return <div className={classes.root}>
        <ProposalsHeader/>
    </div>
}

export default Proposals

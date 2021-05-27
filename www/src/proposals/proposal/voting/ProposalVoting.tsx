import React from 'react'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import MotionCard from './MotionCard';
import {useTranslation} from "react-i18next";
import {ProposalDto, ProposalMotion} from "../../proposals.dto";
import NoMotion from "./NoMotion";
/*
ProposalVoting:
    MotionCard:
      MotionHeader
        "Motion", Aye/Nay Icon, Curent Results
        "Votion end" End Date (#Block number)
      <Divider/>
      MotionBody
        List of Votes:
          Icon, Account Name, "Aye"/"Nay"
*/

const useStyles = makeStyles( (theme: Theme) => createStyles({
    root: {
        maxWidth: '425px',
        minWidth: '360px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'spaceBetween'
    }
}));

interface MotionsProp {
    motions: ProposalMotion[]
}
const Motions: React.FC<MotionsProp> = ({motions}) => {
    const styles = useStyles();

    const classes = useSuccessfullyLoadedItemStyles()
    const {t} = useTranslation();
    return (
        <div className={styles.root}>
            {
                motions.map(motion => <MotionCard key={motion.hash} motion={motion}/>)
            }
        </div>
    )
}

interface ProposalVotingProps {
    proposal: ProposalDto
}

const ProposalVoting = ({proposal}: ProposalVotingProps) => {
    return (
        proposal.motions?.length ? <Motions motions={proposal.motions}/> : <NoMotion proposalIndex={proposal.proposalIndex} />
    );
}

export default ProposalVoting;

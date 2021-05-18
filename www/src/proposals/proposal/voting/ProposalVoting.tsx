import React from 'react'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import MotionCard from './MotionCard';
import {useTranslation} from "react-i18next";
import {ProposalDto} from "../../proposals.dto";
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

interface ProposalVotingProps {
    proposal: ProposalDto
}

const ProposalVoting: React.FC<ProposalVotingProps> = ({proposal}) => {
    const styles = useStyles();
    const classes = useSuccessfullyLoadedItemStyles()
    // return <div className={classes.content}>Voting</div>
    const {t} = useTranslation();
    return (
        <div className={styles.root}>
            { proposal.council?.length ?
                proposal.council.map(motion => <MotionCard key={motion.hash} motion={motion}/>) :
                <p>{t('proposal.voting.noMotion')}</p>
            }
        </div>
    )
}

export default ProposalVoting;

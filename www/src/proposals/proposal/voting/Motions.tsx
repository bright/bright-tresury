import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {ProposalMotion} from "../../proposals.api";
import MotionCard from "./MotionCard";
import React from "react";

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

const Motions = ({motions}: MotionsProp) => {
    const styles = useStyles();
    return (
        <div className={styles.root}>
            {
                motions.map(motion => <MotionCard key={motion.hash} motion={motion}/>)
            }
        </div>
    )
}

export default Motions;

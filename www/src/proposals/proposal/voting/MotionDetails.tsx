import {CardDetails} from "../../../components/card/components/CardDetails";
import React from "react";
import {AddressInfo} from "../../../components/identicon/AddressInfo";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Theme} from "@material-ui/core";
interface MotionDetailsProps {
    ayes: any, nays: any
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: '10px 20px'
    },
    vote: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItem: 'center'
    }
}));

const MotionDetails: React.FC<MotionDetailsProps> = ({ayes, nays}) => {
    const styles = useStyles();
    const Vote = (vote:any, isAye:boolean) => (
        <div className={styles.vote} key={`${isAye ? 'aye' : 'nay'}_${vote.address}`}>
            <AddressInfo address={vote.address} label={vote.display || ''}></AddressInfo>
            <span style={{}}>{isAye ? 'Aye' : 'Nay'}</span>
        </div>
    )
    return <CardDetails>
        <div className={styles.root}>
            {

                [
                    ...ayes.map((aye: any) => Vote(aye, true)),
                    ...nays.map((nay: any) => Vote(nay, false))
                ]
            }
        </div>
    </CardDetails>
}
export default MotionDetails

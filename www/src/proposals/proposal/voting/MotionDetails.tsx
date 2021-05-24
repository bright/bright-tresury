import {CardDetails} from "../../../components/card/components/CardDetails";
import React from "react";
import {AddressInfo} from "../../../components/identicon/AddressInfo";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Theme} from "@material-ui/core";
import {AddressInfoWithLabel} from "../../../components/identicon/AddressInfoWithLabel";
import {AccountInfo} from "../../proposals.api";
interface MotionDetailsProps {
    ayes: AccountInfo[]
    nays: AccountInfo[]
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
    const Vote = (vote: AccountInfo, isAye: boolean) => (
        <div className={styles.vote} key={`${isAye ? 'aye' : 'nay'}_${vote.address}`}>
            <AddressInfoWithLabel address={vote.address} label={vote.display || ''}></AddressInfoWithLabel>
            <span style={{}}>{isAye ? 'Aye' : 'Nay'}</span>
        </div>
    )
    return <CardDetails>
        <div className={styles.root}>
            {

                [
                    ...ayes.map((aye: AccountInfo) => Vote(aye, true)),
                    ...nays.map((nay: AccountInfo) => Vote(nay, false))
                ]
            }
        </div>
    </CardDetails>
}
export default MotionDetails

import React from "react";
import {CardHeader} from "../../../components/card/components/CardHeader";
import ayeIcon from "../../../assets/aye.svg";
import nayIcon from "../../../assets/nay.svg";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Time} from "@polkadot/util/types";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles( (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        padding: '0px 16px 8px 16px',
        width: '100%'
    },
    upperRow: {

        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '4px'
    },
    voteCount: {
      margin: '2px'
    },
    lowerRow: {
        fontSize: 12,
        color: theme.palette.text.disabled,
        fontWeight: theme.typography.fontWeightRegular
    },
    remainingTime: {
      color: theme.palette.text.primary
    },
    greenAye: {
        color: theme.palette.success.main
    },
    redNay: {
        color: theme.palette.error.main
    }
}));

interface MotionHeaderProps {
    method: string,
    end: {
        endBlock: number,
        remainingBlocks: number,
        timeLeft: Time
    },
    ayesCount: number,
    naysCount: number
}

const MotionHeader: React.FC<MotionHeaderProps> = ({method, ayesCount, naysCount, end}) => {
    const styles = useStyles();
    const {t} = useTranslation()
    const isApprovalMotion = method === 'approveProposal';
    const {endBlock, timeLeft} = end;
    const { days, hours, minutes, seconds } = timeLeft;
    const singularPluralOrNull = (count: number, singular: string, plural: string): string | null =>
        count ? count > 1 ? `${count}${plural}` : `1${singular}` : null;
    const timeStr = [
        singularPluralOrNull(days, 'day', 'days'), singularPluralOrNull(hours, 'hr', 'hrs'),
        singularPluralOrNull(minutes, 'min', 'mins'), singularPluralOrNull(seconds, 's', 's')
        ]
        .filter((value): value is string => !!value)
        .slice(0, 2)
        .join(' ');

    return (
            <CardHeader>
                <div className={styles.root}>
                    <div className={styles.upperRow}>
                        <strong>{t('proposal.voting.motion')} <img src={isApprovalMotion ? ayeIcon : nayIcon} alt={''}/> </strong>
                        <div>
                            <strong className={styles.voteCount}><span
                                className={styles.greenAye}>Aye</span> ({ayesCount})</strong>
                            <strong className={styles.voteCount}><span className={styles.redNay}>Nay</span> ({naysCount})</strong>
                        </div>
                    </div>
                    <div className={styles.lowerRow}>
                        {t('proposal.voting.votingEnd')}<strong className={styles.remainingTime}> {timeStr} (#{endBlock.toLocaleString('en-US')})</strong>
                    </div>
                </div>
            </CardHeader>
    )
}
export default MotionHeader;

import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {ROUTE_IDEAS} from "../../routes";
import {IdeaDto} from "../ideas.api";
import {Button} from "../../components/button/Button";
import SubmitProposalModal from "../SubmitProposalModal";
import {breakpoints} from "../../theme/theme";
import IdeaContentTypeTabs from "./IdeaContentTypeTabs";
import {Divider} from "../../components/divider/Divider";
import {IdeaStatusIndicator} from "./status/IdeaStatusIndicator";
import {NetworkRewardDeposit} from "../../components/network/NetworkRewardDeposit";
import {CloseIcon} from "../../components/closeIcon/CloseIcon";
import {OptionalTitle} from "../../components/text/OptionalTitle";
import {IdeaOrdinalNumber} from "../list/IdeaOrdinalNumber";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        headerContainer: {
            background: theme.palette.background.default,
            padding: '2em 7em 2em 3em',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '1em 2.2em 1em 2.2em'
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: 0,
                paddingRight: 0
            },
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap'
        },
        basicInfo: {
            order: 1,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: '1.5em',
            },
        },
        basicInfoDivider: {
            height: '20px',
            marginLeft: '2em',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginLeft: '1em'
            }
        },
        status: {
            marginLeft: '2em',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginLeft: '1em'
            },
        },
        ideaTitleBreakLine: {
            height: 0,
        },
        ideaTitle: {
            marginRight: '.5em',
            fontSize: 18,
            flexBasis: '100%',
            marginTop: '24px',
        },
        ideaId: {
            fontSize: '18px',
            maxWidth: '60%',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
        },
        networkValues: {
            alignSelf: 'flex-start',
            order: 2,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 4,
                marginTop: '16px',
                justifyContent: 'center',
                width: '100%',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 2,
                paddingLeft: '1.5em',
                paddingRight: '1.5em'
            }
        },
        flexBreakLine: {
            flexBasis: '100%',
            height: 0,
            order: 3
        },
        contentTypeTabs: {
            marginTop: '24px',
            order: 4,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 5,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                overflowX: 'auto',
                paddingLeft: '1.5em'
            }
        },
        convertToProposal: {
            order: 5,
            [theme.breakpoints.up(breakpoints.mobile)]: {
                alignSelf: 'flex-end'
            },
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 2,
                alignSelf: 'flex-end',
                marginBottom: 24
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                position: 'fixed',
                padding: 16,
                background: theme.palette.background.default,
                bottom: 0,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                width: '100vw',
                zIndex: 1
            }
        },
        convertToProposalButton: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                width: '100%'
            }
        }
    }))

interface Props {
    idea: IdeaDto,
    canEdit: boolean
}

const IdeaHeader: React.FC<Props> = ({idea, canEdit}) => {
    const classes = useStyles()
    const {t} = useTranslation()
    const history = useHistory()

    const [submitProposalVisibility, setSubmitProposalVisibility] = useState(false);

    const navigateToList = () => {
        history.push(ROUTE_IDEAS)
    }

    const networkValue = idea.networks && idea.networks.length > 0 ? idea.networks[0].value : 0

    return <div className={classes.headerContainer}>
        <CloseIcon onClose={navigateToList}/>

        <div className={classes.basicInfo}>
            <IdeaOrdinalNumber ordinalNumber={idea.ordinalNumber}/>
            <Divider className={classes.basicInfoDivider} orientation="vertical"/>
            <div className={classes.status}>
                <IdeaStatusIndicator ideaStatus={idea.status}/>
            </div>
            <div className={classes.ideaTitleBreakLine}/>
            <div className={classes.ideaTitle}>
                <OptionalTitle title={idea.title}/>
            </div>
        </div>
        <div className={classes.networkValues}>
            <NetworkRewardDeposit rewardValue={networkValue}/>
        </div>
        <div className={classes.flexBreakLine}/>
        <div className={classes.contentTypeTabs}>
            <IdeaContentTypeTabs/>
        </div>
        {canEdit ? <>
            {!!idea.id && <div className={classes.convertToProposal}>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.convertToProposalButton}
                    onClick={() => setSubmitProposalVisibility(true)}>
                    {t('idea.details.header.convertToProposal')}
                </Button>
            </div>
            }
            <SubmitProposalModal
                open={submitProposalVisibility}
                onClose={() => setSubmitProposalVisibility(false)}
                idea={idea}/>
        </> : null}
    </div>
}

export default IdeaHeader

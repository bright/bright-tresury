import React, {useState} from 'react';
import crossSvg from "../../assets/cross.svg";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {Header} from "../../components/header/Header";
import {ROUTE_IDEAS} from "../../routes";
import {IconButton} from "../../components/button/IconButton";
import {IdeaDto} from "../ideas.api";
import {Button} from "../../components/button/Button";
import SubmitProposalModal from "../SubmitProposalModal";
import {breakpoints} from "../../theme/theme";
import IdeaContentTypeTabs from "./IdeaContentTypeTabs";
import {Divider} from "../../components/divider/Divider";
import {Amount} from "../../components/amount/Amount";
import {calculateBondValue} from "../../networks/bondUtil";
import config from "../../config";
import {IdeaStatusIndicator} from "./status/IdeaStatusIndicator";

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
        closeIcon: {
            position: 'absolute',
            top: 32,
            right: 32,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                top: 20,
                right: 16
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                top: 70,
                right: 8,
            }
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
            flexBasis: '100%'
        },
        ideaTitle: {
            marginRight: '.75em'
        },
        ideaId: {
            fontSize: '18px',
            maxWidth: '60%',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
        },
        networkValues: {
            display: 'flex',
            flexDirection: 'row',
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
        networkReward: {
            flex: 1
        },
        networkDeposit: {
            flex: 1,
            marginLeft: '32px',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginLeft: '18px'
            },
        },
        flexBreakLine: {
            flexBasis: '100%',
            height: 0,
            order: 3
        },
        contentTypeTabs: {
            marginTop: '20px',
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
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 2,
                alignSelf: 'flex-end'
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
    }),
);

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
    const bondValue = networkValue ? calculateBondValue(networkValue) : 0

    return <div className={classes.headerContainer}>
        <IconButton className={classes.closeIcon} svg={crossSvg} onClick={navigateToList}/>

        <div className={classes.basicInfo}>
            <p className={classes.ideaId}>
                {idea.id}
            </p>
            <Divider className={classes.basicInfoDivider} orientation="vertical"/>
            <div className={classes.status}>
                <IdeaStatusIndicator ideaStatus={idea.status}/>
            </div>
            <div className={classes.ideaTitleBreakLine}/>
            <div className={classes.ideaTitle}>
                <Header>
                    {idea.title}
                </Header>
            </div>
        </div>
        <div className={classes.networkValues}>
            <div className={classes.networkReward}>
                <Amount amount={networkValue}
                        currency={config.NETWORK_CURRENCY}
                        label={t('idea.content.info.reward')}/>
            </div>
            <div className={classes.networkDeposit}>
                <Amount amount={bondValue}
                        currency={config.NETWORK_CURRENCY}
                        label={t('idea.content.info.deposit')}
                />
            </div>
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

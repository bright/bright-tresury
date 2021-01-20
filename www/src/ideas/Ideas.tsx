import Grid from '@material-ui/core/Grid';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React, {useEffect, useMemo, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {ROUTE_NEW_IDEA} from '../routes';
import {getIdeasByNetwork, IdeaDto} from './ideas.api';
import {Button} from "../components/button/Button";
import {useTranslation} from "react-i18next";
import IdeaCard from "./list/IdeaCard";
import {breakpoints} from "../theme/theme";
import IdeaStatusFilters, {DefaultFilter, FilterSearchParamName, IdeaFilter} from "./list/IdeaStatusFilters";
import {Select} from "../components/select/Select";
import config from '../config';
import {filterIdeas} from "./list/filterIdeas";

const useStyles = makeStyles((theme: Theme) => {
    const horizontalMargin = '32px'
    const mobileHorizontalMargin = '18px'
    return createStyles({
        header: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingTop: '32px',
        },
        newIdeaButton: {
            margin: `0 ${horizontalMargin}`,
            order: 1,
            fontWeight: 700,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginBottom: '8px'
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                fontSize: '15px',
                margin: `0px ${mobileHorizontalMargin} 16px ${mobileHorizontalMargin}`,
                flex: 1
            },
        },
        flexBreakLine: {
            order: 3,
            [theme.breakpoints.up(breakpoints.mobile)]: {
                flexBasis: '100%',
                height: 0,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 2,
            }
        },
        timeSelectWrapper: {
            order: 5,
            borderRadius: '8px',
            margin: `32px ${horizontalMargin}`,
            backgroundColor: theme.palette.primary.light,
            [theme.breakpoints.up(breakpoints.tablet)]: {
                height: '32px'
            },
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 2,
                margin: `0 ${horizontalMargin}`
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 2,
                borderRadius: '0',
                margin: `0`,
                background: theme.palette.background.paper,
                paddingTop: '8px',
                paddingLeft: mobileHorizontalMargin
            },
        },
        timeSelect: {
            fontWeight: 600,
            [theme.breakpoints.up(breakpoints.tablet)]: {
                height: '32px',
            },
        },
        paperBackground: {
            display: 'none',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                display: 'initial',
                flexGrow: 1,
                order: 4,
                backgroundColor: theme.palette.background.paper
            }
        },
        statusFilters: {
            order: 4,
            margin: `${horizontalMargin}`,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 3,
                margin: `12px ${horizontalMargin}`,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 5,
                margin: 0,
                background: theme.palette.background.paper,
                paddingTop: '8px',
                paddingRight: mobileHorizontalMargin
            }
        },
        tilesContainer: {
            padding: `26px ${horizontalMargin}`,
            backgroundColor: theme.palette.background.paper,
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: `8px ${mobileHorizontalMargin} 26px ${mobileHorizontalMargin}`,
            },
        },
    })
});

interface Props {
    network: string
}

const Ideas: React.FC<Props> = ({network = config.NETWORK_NAME}) => {
    const classes = useStyles()
    const history = useHistory()
    const {t} = useTranslation()
    const location = useLocation()

    const [ideas, setIdeas] = useState<IdeaDto[]>([])
    const [status, setStatus] = useState<string>('')

    const filter = useMemo(() => {
        const filterParam = new URLSearchParams(location.search).get(FilterSearchParamName)
        return filterParam ? filterParam as IdeaFilter : DefaultFilter
    }, [location.search])

    const filteredIdeas = useMemo(() => {
        return filterIdeas(ideas, filter)
    }, [filter, ideas])

    useEffect(() => {
        setStatus('loading')
        getIdeasByNetwork(network)
            .then((response: IdeaDto[]) => {
                setIdeas(response)
                setStatus('resolved')
            })
            .catch(() => {
                setStatus('error')
            })
    }, [network])

    const goToNewIdea = () => {
        history.push(ROUTE_NEW_IDEA)
    }

    return (
        <div>
            <div className={classes.header}>
                <Button className={classes.newIdeaButton}
                        variant="contained"
                        color="primary"
                        onClick={goToNewIdea}>
                    {t('idea.introduce')}
                </Button>
                <div className={classes.flexBreakLine}/>
                <div className={classes.timeSelectWrapper}>
                    <Select
                        className={classes.timeSelect}
                        value={t('idea.list.filters.currentSpendTime')}
                        options={[t('idea.list.filters.currentSpendTime')]}
                    />
                </div>
                <div className={classes.paperBackground}/>
                <div className={classes.statusFilters}>
                    <IdeaStatusFilters filter={filter}/>
                </div>
            </div>
            <div className={classes.tilesContainer}>
                <Grid container spacing={2}>
                    {status === 'loading' && <p>Loading</p>}
                    {status === 'error' && <p>Error</p>}
                    {status === 'resolved' && (
                        filteredIdeas.map((idea) => (
                            <Grid key={idea.id} item xs={12} md={6}>
                                <IdeaCard idea={idea}/>
                            </Grid>
                        ))
                    )}
                </Grid>
            </div>
        </div>
    );
}

export default Ideas

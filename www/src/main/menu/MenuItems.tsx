import statsSvg from '../../assets/menu_stats.svg'
import statsHighlightedSvg from '../../assets/menu_stats_highlighted.svg'
import ideasSvg from '../../assets/menu_ideas.svg'
import ideasHighlightedSvg from '../../assets/menu_ideas_highlighted.svg'
import proposalsSvg from '../../assets/menu_proposals.svg'
import proposalsHighlightedSvg from '../../assets/menu_proposals_highlighted.svg'
import tipsSvg from '../../assets/menu_tips.svg'
import tipsHighlightedSvg from '../../assets/menu_tips_highlighted.svg'
import bountySvg from '../../assets/menu_bounty.svg'
import bountyHighlightedSvg from '../../assets/menu_bounty_highlighted.svg'
import { ROUTE_BOUNTIES, ROUTE_IDEAS, ROUTE_PROPOSALS, ROUTE_STATS, ROUTE_TIPS } from '../../routes/routes'
import config from '../../config'

export interface MenuItem {
    translationKey: string
    svg: string
    svgHighlighted: string
    path: string
}

const MENU_ITEMS_ADDITIONAL: MenuItem[] = [
    {
        translationKey: 'menu.tips',
        svg: tipsSvg,
        svgHighlighted: tipsHighlightedSvg,
        path: ROUTE_TIPS,
    }
]

export const MENU_ITEMS: MenuItem[] = [
    {
        translationKey: 'menu.stats',
        svg: statsSvg,
        svgHighlighted: statsHighlightedSvg,
        path: ROUTE_STATS,
    },
    {
        translationKey: 'menu.ideas',
        svg: ideasSvg,
        svgHighlighted: ideasHighlightedSvg,
        path: ROUTE_IDEAS,
    },
    {
        translationKey: 'menu.proposals',
        svg: proposalsSvg,
        svgHighlighted: proposalsHighlightedSvg,
        path: ROUTE_PROPOSALS,
    },
    {
        translationKey: 'menu.bounties',
        svg: bountySvg,
        svgHighlighted: bountyHighlightedSvg,
        path: ROUTE_BOUNTIES,
    }
].concat(config.env === 'prod' || config.env === 'qa' ? [] : MENU_ITEMS_ADDITIONAL)

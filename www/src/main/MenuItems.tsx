import StatsSvg from "../assets/menu_stats.svg";
import StatsHighlightedSvg from "../assets/menu_stats_highlighted.svg";
import IdeasSvg from "../assets/menu_ideas.svg";
import IdeasHighlightedSvg from "../assets/menu_ideas_highlighted.svg";
import ProposalsSvg from "../assets/menu_proposals.svg";
import ProposalsHighlightedSvg from "../assets/menu_proposals_highlighted.svg";
import TipsSvg from "../assets/menu_tips.svg";
import TipsHighlightedSvg from "../assets/menu_tips_highlighted.svg";
import BountySvg from "../assets/menu_bounty.svg";
import BountyHighlightedSvg from "../assets/menu_bounty_highlighted.svg";
import {ROUTE_BOUNTY, ROUTE_IDEAS, ROUTE_PROPOSALS, ROUTE_STATS, ROUTE_TIPS} from "../routes";

export interface MenuItem {
    translationKey: string
    svg: string
    svgHighlighted: string
    path: string
}

export const MENU_ITEMS: MenuItem[] = [
    {
        translationKey: 'menu.stats',
        svg: StatsSvg,
        svgHighlighted: StatsHighlightedSvg,
        path: ROUTE_STATS
    },
    {
        translationKey: 'menu.ideas',
        svg: IdeasSvg,
        svgHighlighted: IdeasHighlightedSvg,
        path: ROUTE_IDEAS
    },
    {
        translationKey: 'menu.proposals',
        svg: ProposalsSvg,
        svgHighlighted: ProposalsHighlightedSvg,
        path: ROUTE_PROPOSALS
    },
    {
        translationKey: 'menu.tips',
        svg: TipsSvg,
        svgHighlighted: TipsHighlightedSvg,
        path: ROUTE_TIPS
    },
    {
        translationKey: 'menu.bounty',
        svg: BountySvg,
        svgHighlighted: BountyHighlightedSvg,
        path: ROUTE_BOUNTY
    }
]

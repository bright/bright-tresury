import StatsSvg from "../assets/menu_stats.svg";
import IdeasSvg from "../assets/menu_ideas.svg";
import ProposalsSvg from "../assets/menu_proposals.svg";
import TipsSvg from "../assets/menu_tips.svg";
import BountySvg from "../assets/menu_bounty.svg";
import {ROUTE_BOUNTY, ROUTE_IDEA, ROUTE_IDEAS, ROUTE_PROPOSALS, ROUTE_ROOT, ROUTE_STATS, ROUTE_TIPS} from "../routes";

export interface MenuItem {
    translationKey: string
    svg: string
    path: string
}

export const MENU_ITEMS: MenuItem[] = [
    {
        translationKey: 'menu.stats',
        svg: StatsSvg,
        path: ROUTE_STATS
    },
    {
        translationKey: 'menu.ideas',
        svg: IdeasSvg,
        path: ROUTE_IDEAS
    },
    {
        translationKey: 'menu.proposals',
        svg: ProposalsSvg,
        path: ROUTE_PROPOSALS
    },
    {
        translationKey: 'menu.tips',
        svg: TipsSvg,
        path: ROUTE_TIPS
    },
    {
        translationKey: 'menu.bounty',
        svg: BountySvg,
        path: ROUTE_BOUNTY
    }
]

import { renderHook } from '@testing-library/react-hooks'
import { IdeaDto, IdeaNetworkStatus, IdeaStatus } from '../../ideas.dto'
import * as useIdea from '../useIdea'
import { UseIdeaResult } from '../useIdea'
import {
    IdeaMilestoneDto,
    IdeaMilestoneNetworkDto,
    IdeaMilestoneNetworkStatus,
    IdeaMilestoneStatus,
} from './idea.milestones.dto'
import { useIdeaMilestone } from './useIdeaMilestone'
import { NetworkPlanckValue } from '../../../util/types'
import { PublicUserDto } from '../../../util/publicUser.dto'

describe('useIdeaMilestone', () => {
    const mockUseIdea = (mockParams: Partial<UseIdeaResult>) => {
        return jest.spyOn(useIdea, 'useIdea').mockReturnValue({
            isOwner: true,
            isIdeaEditable: true,
            canEditIdea: true,
            isIdeaMilestonesEditable: true,
            canEditIdeaMilestones: true,
            canTurnIntoProposal: true,
            ...mockParams,
        })
    }

    const idea: IdeaDto = {
        id: '5cd895d2-8b44-4d39-b580-b338018cd5a5',
        ordinalNumber: 1,
        beneficiary: { web3address: '' },
        currentNetwork: {
            id: '5cd895d2-8b44-4d39-b580-b338018cd5a5',
            name: 'polkadot',
            value: '0' as NetworkPlanckValue,
            status: IdeaNetworkStatus.Active,
            blockchainProposalId: undefined,
        },
        additionalNetworks: [],
        status: IdeaStatus.Active,
        owner: { userId: '5cd895d2-8b44-4d39-b580-b338018cd5a5' } as PublicUserDto,
        details: {
            title: 'title',
            content: 'content',
        },
    }

    const milestoneNetwork: IdeaMilestoneNetworkDto = {
        id: '5cd895d2-8b44-4d39-b580-b338018cd5a5',
        name: 'polkadot',
        value: '1' as NetworkPlanckValue,
        status: IdeaMilestoneNetworkStatus.Active,
    }
    const milestone: IdeaMilestoneDto = {
        id: '5cd895d2-8b44-4d39-b580-b338018cd5a5',
        ordinalNumber: 1,
        status: IdeaMilestoneStatus.Active,
        beneficiary: undefined,
        details: {
            subject: '',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        currentNetwork: milestoneNetwork,
        additionalNetworks: [milestoneNetwork, milestoneNetwork],
    }

    beforeEach(() => {
        mockUseIdea({})
    })

    const renderHookUseIdeaMilestone = (idea: IdeaDto, milestone?: IdeaMilestoneDto) => {
        const { result } = renderHook(() => useIdeaMilestone(idea, milestone))
        return result.current
    }

    describe('canEdit', () => {
        it('should return false when cannot edit idea milestones', () => {
            mockUseIdea({ canEditIdeaMilestones: false })
            const { canEdit } = renderHookUseIdeaMilestone({ ...idea }, milestone)
            expect(canEdit).toBe(false)
        })
        describe('when can edit idea milestones', () => {
            it('should return true when milestone status is Active', () => {
                mockUseIdea({ canEditIdeaMilestones: true })
                const { canEdit } = renderHookUseIdeaMilestone(
                    { ...idea },
                    { ...milestone, status: IdeaMilestoneStatus.Active },
                )
                expect(canEdit).toBe(true)
            })
            it('should return false when milestone status is TurnedIntoProposal', () => {
                mockUseIdea({ canEditIdeaMilestones: true })
                const { canEdit } = renderHookUseIdeaMilestone(
                    { ...idea },
                    { ...milestone, status: IdeaMilestoneStatus.TurnedIntoProposal },
                )
                expect(canEdit).toBe(false)
            })
            it('should return true when no milestone', () => {
                mockUseIdea({ canEditIdeaMilestones: true })
                const { canEdit } = renderHookUseIdeaMilestone({ ...idea })
                expect(canEdit).toBe(true)
            })
        })
    })

    describe('canTurnIntoProposal', () => {
        it('should return false when not idea owner', () => {
            mockUseIdea({ isOwner: false })
            const { canTurnIntoProposal } = renderHookUseIdeaMilestone({ ...idea }, milestone)
            expect(canTurnIntoProposal).toBe(false)
        })

        it('should return false when no idea milestone', () => {
            const { canTurnIntoProposal } = renderHookUseIdeaMilestone({ ...idea })
            expect(canTurnIntoProposal).toBe(false)
        })

        describe('with idea owner and milestone', () => {
            it('should return true when idea is active', () => {
                const { canTurnIntoProposal } = renderHookUseIdeaMilestone(
                    { ...idea, status: IdeaStatus.Active },
                    milestone,
                )
                expect(canTurnIntoProposal).toBe(true)
            })

            it('should return false when idea is draft', () => {
                const { canTurnIntoProposal } = renderHookUseIdeaMilestone(
                    { ...idea, status: IdeaStatus.Draft },
                    milestone,
                )
                expect(canTurnIntoProposal).toBe(false)
            })

            it('should return false when idea is pending', () => {
                const { canTurnIntoProposal } = renderHookUseIdeaMilestone(
                    { ...idea, status: IdeaStatus.Pending },
                    milestone,
                )
                expect(canTurnIntoProposal).toBe(false)
            })

            it('should return false when idea is turned into proposal', () => {
                const { canTurnIntoProposal } = renderHookUseIdeaMilestone(
                    {
                        ...idea,
                        status: IdeaStatus.TurnedIntoProposal,
                    },
                    milestone,
                )
                expect(canTurnIntoProposal).toBe(false)
            })
            describe('and idea is milestone submission', () => {
                const ideaWithMilestoneSubmission = { ...idea, status: IdeaStatus.MilestoneSubmission }
                it('should return true when milestone network status is active', () => {
                    const { canTurnIntoProposal } = renderHookUseIdeaMilestone(ideaWithMilestoneSubmission, {
                        ...milestone,
                        currentNetwork: {
                            status: IdeaMilestoneNetworkStatus.Active,
                        },
                    } as IdeaMilestoneDto)
                    expect(canTurnIntoProposal).toBe(true)
                })
                it('should return true when milestone network status is pending', () => {
                    const { canTurnIntoProposal } = renderHookUseIdeaMilestone(ideaWithMilestoneSubmission, {
                        ...milestone,
                        currentNetwork: {
                            status: IdeaMilestoneNetworkStatus.Pending,
                        },
                    } as IdeaMilestoneDto)
                    expect(canTurnIntoProposal).toBe(true)
                })
                it('should return false when milestone network status is turned into proposal', () => {
                    const { canTurnIntoProposal } = renderHookUseIdeaMilestone(ideaWithMilestoneSubmission, {
                        ...milestone,
                        currentNetwork: {
                            status: IdeaMilestoneNetworkStatus.TurnedIntoProposal,
                        },
                    } as IdeaMilestoneDto)
                    expect(canTurnIntoProposal).toBe(false)
                })
            })
        })
    })

    describe('canEditIdeaMilestoneNetwork', () => {
        it('should return false when cannot edit idea milestones', () => {
            mockUseIdea({ canEditIdeaMilestones: false })
            const { canEditAnyIdeaMilestoneNetwork } = renderHookUseIdeaMilestone({ ...idea }, milestone)
            expect(canEditAnyIdeaMilestoneNetwork).toBe(false)
        })

        it('should return true when status is active', () => {
            const { canEditIdeaMilestoneNetwork } = renderHookUseIdeaMilestone({ ...idea })
            expect(canEditIdeaMilestoneNetwork(IdeaMilestoneNetworkStatus.Active)).toBe(true)
        })
        it('should return true when status is pending', () => {
            const { canEditIdeaMilestoneNetwork } = renderHookUseIdeaMilestone({ ...idea })
            expect(canEditIdeaMilestoneNetwork(IdeaMilestoneNetworkStatus.Pending)).toBe(true)
        })
        it('should return false when status is turned into proposal', () => {
            const { canEditIdeaMilestoneNetwork } = renderHookUseIdeaMilestone({ ...idea })
            expect(canEditIdeaMilestoneNetwork(IdeaMilestoneNetworkStatus.TurnedIntoProposal)).toBe(false)
        })
    })

    describe('canEditAnyIdeaMilestoneNetwork', () => {
        it('should return true when no milestone', () => {
            const { canEditAnyIdeaMilestoneNetwork } = renderHookUseIdeaMilestone({ ...idea })
            expect(canEditAnyIdeaMilestoneNetwork).toBe(true)
        })

        it('should return false when cannot edit idea milestones', () => {
            mockUseIdea({ canEditIdeaMilestones: false })
            const { canEditAnyIdeaMilestoneNetwork } = renderHookUseIdeaMilestone({ ...idea }, milestone)
            expect(canEditAnyIdeaMilestoneNetwork).toBe(false)
        })

        it('should return false when current network and additional networks turned into proposal', () => {
            const { canEditAnyIdeaMilestoneNetwork } = renderHookUseIdeaMilestone({ ...idea }, {
                currentNetwork: { status: IdeaMilestoneNetworkStatus.TurnedIntoProposal },
                additionalNetworks: [
                    { status: IdeaMilestoneNetworkStatus.TurnedIntoProposal },
                    { status: IdeaMilestoneNetworkStatus.TurnedIntoProposal },
                ],
            } as IdeaMilestoneDto)
            expect(canEditAnyIdeaMilestoneNetwork).toBe(false)
        })
        it('should return true when can edit current idea milestone network', () => {
            const { canEditAnyIdeaMilestoneNetwork } = renderHookUseIdeaMilestone({ ...idea }, {
                currentNetwork: { status: IdeaMilestoneNetworkStatus.Active },
                additionalNetworks: [{ status: IdeaMilestoneNetworkStatus.TurnedIntoProposal }],
            } as IdeaMilestoneDto)
            expect(canEditAnyIdeaMilestoneNetwork).toBe(true)
        })
        it('should return true when can edit one of additional idea milestone network', () => {
            const { canEditAnyIdeaMilestoneNetwork } = renderHookUseIdeaMilestone({ ...idea }, {
                currentNetwork: { status: IdeaMilestoneNetworkStatus.TurnedIntoProposal },
                additionalNetworks: [
                    { status: IdeaMilestoneNetworkStatus.Active },
                    { status: IdeaMilestoneNetworkStatus.TurnedIntoProposal },
                ],
            } as IdeaMilestoneDto)
            expect(canEditAnyIdeaMilestoneNetwork).toBe(true)
        })
    })
})

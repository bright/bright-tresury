export const ROUTE_ROOT = '/'
// region stats
export const ROUTE_STATS = '/stats'
// endregion
// region Ideas
export const ROUTE_IDEAS = '/ideas'
export const ROUTE_NEW_IDEA = '/ideas/new'
export const ROUTE_EDIT_IDEA = '/ideas/:ideaId/edit'
export const ROUTE_TURN_IDEA = '/ideas/:ideaId/turn'
export const ROUTE_IDEA = '/ideas/:ideaId'
// endregion
// region Proposals
export const ROUTE_PROPOSALS = '/proposals'
export const ROUTE_PROPOSAL = '/proposals/:proposalIndex'
export const ROUTE_EDIT_PROPOSAL = '/proposals/:proposalIndex/edit'
// endregion
// region Tips
export const ROUTE_TIPS = '/tips'
export const ROUTE_TIP = '/tips/:tipHash'
export const ROUTE_NEW_TIP = '/tips/new'
// endregion
// region Bounties
export const ROUTE_BOUNTIES = '/bounties'
export const ROUTE_NEW_BOUNTY = '/bounties/new'
export const ROUTE_EDIT_BOUNTY = '/bounties/:bountyIndex/edit'
export const ROUTE_AWARD_BOUNTY = '/bounties/:bountyIndex/award'
export const ROUTE_EXTEND_EXPIRY_BOUNTY = '/bounties/:bountyIndex/extend-expiry'
export const ROUTE_BOUNTY = '/bounties/:bountyIndex'
export const ROUTE_BOUNTY_DISCUSSION = '/bounties/:bountyIndex/discussion'
// endregion
// region Child Bounties
export const ROUTE_CHILD_BOUNTIES = '/bounties/:bountyIndex/child-bounties'
export const ROUTE_CHILD_BOUNTY = '/bounties/:bountyIndex/child-bounties/:childBountyIndex'
export const ROUTE_NEW_CHILD_BOUNTY = '/bounties/:bountyIndex/child-bounties/new'
export const ROUTE_AWARD_CHILD_BOUNTY = '/bounties/:bountyIndex/child-bounties/:childBountyIndex/award'
export const ROUTE_ASSIGN_CHILD_BOUNTY_CURATOR =
    '/bounties/:bountyIndex/child-bounties/:childBountyIndex/assign-curator'
export const ROUTE_EDIT_CHILD_BOUNTY = '/bounties/:bountyIndex/child-bounties/:childBountyIndex/edit'
// endregion
// region Auth
export const ROUTE_SIGNUP = '/auth/signup'
export const ROUTE_SIGNIN = '/auth/signin'
export const ROUTE_SIGNUP_EMAIL = '/auth/signup/email'
export const ROUTE_SIGNUP_WEB3 = '/auth/signup/web3'
export const ROUTE_SIGNUP_WEB3_SUCCESS = '/signup/web3/success'
export const ROUTE_SIGNUP_EMAIL_SUCCESS = '/signup/email/success'
export const ROUTE_SIGNIN_EMAIL = '/auth/signin/email'
export const ROUTE_SIGNIN_WEB3 = '/auth/signin/web3'
export const ROUTE_VERIFY_EMAIL = '/auth/verify-email'
export const ROUTE_EMAIL_NOT_VERIFIED = '/auth/email-not-verified'
export const ROUTE_PASSWORD_RECOVERY = '/auth/password-recovery'
export const ROUTE_NEW_PASSWORD = '/auth/reset-password'
// endregion
// region Account
export const ROUTE_ACCOUNT = '/account'
export const ROUTE_ACCOUNT_DELETED = '/account-deleted'
// endregion
// region Privacy
export const ROUTE_PRIVACY = '/privacy'
// endregion
// region Terms
export const ROUTE_TERMS = '/terms'
// endregion
// region Learn More
export const ROUTE_LEARN_MORE = '/learn-more'
// // endregion

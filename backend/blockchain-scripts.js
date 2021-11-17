const { ApiPromise, Keyring, WsProvider } = require('@polkadot/api')

const getPolkadotApi = async () => {
    const onConnected = (args) => {
        console.log('Connected to substrate node')
    }
    const onReady = (args) => {
        console.log('ApiPromise ready')
    }
    const onError = (error) => {
        console.log('Error when connecting to substrate node:', error)
    }

    // const nodeUrl = 'wss://rpc.polkadot.io';
    const nodeUrl = 'ws://localhost:9944'
    const types = {}

    const provider = new WsProvider(nodeUrl)

    const polkadotApiInstance = new ApiPromise({ provider, types })
    polkadotApiInstance.on('connected', onConnected)
    polkadotApiInstance.on('ready', onReady)
    polkadotApiInstance.on('error', onError)
    try {
        await polkadotApiInstance.isReadyOrError
    } catch (err) {
        console.log('Caught error when connecting to substrate node:', err)
    }
    return polkadotApiInstance
}
const getFreeBalances = async (api, addresses) => {
    const balances = await Promise.all(
        addresses.map(async (address) => ({ [address]: (await api.query.system.account(address)).data.free.toHex() })),
    )
    return balances.reduce((acc, cur) => ({ ...acc, ...cur }), {})
}

const signAndSend = (tx, issuerKeyring) => {
    return new Promise(async (resolve, _) => {
        const unsub = await tx.signAndSend(issuerKeyring, (result) => {
            if (result.status.isInBlock) {
                console.log(`Transaction included at blockHash ${result.status.asInBlock}`)
                unsub()
                resolve()
            }
            // } else if (result.status.isFinalized) {
            //     console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`)
            //
            // }
        })
    })
}
const transfer = (api, fromKeyring, toAddress, amount) => {
    return signAndSend(api.tx.balances.transfer(toAddress, amount), fromKeyring)
}
/**
 * returns ALICE, BOB, CHARLIE, DAVE  - default dev accounts
 * HAS TO BE CALLED AFTER CONNECTED TO POLKADOT NODE
 */
const getDevAccounts = () => {
    const keyring = new Keyring({ type: 'sr25519' })
    const ALICE = keyring.addFromUri('//Alice')
    const BOB = keyring.addFromUri('//Bob')
    const CHARLIE = keyring.addFromUri('//Charlie')
    const DAVE = keyring.addFromUri('//Dave')
    return { ALICE, BOB, CHARLIE, DAVE, keyring }
}

/**
 * 1. Create a motion
 * 2. Vote and close the motion
 * @param api
 */
const createMotionVoteAndClose = async (api, call) => {
    const { ALICE, BOB } = getDevAccounts()
    console.log('Bob creates a motion')
    await signAndSend(api.tx.council.propose(2, call, 100), BOB)

    const motions = (await api.query.council.proposals()).toJSON()
    const hash = motions[motions.length - 1]
    const index = (await api.query.council.voting(hash)).toJSON().index

    console.log(`hash ${hash} and index ${index} of proposal`)
    console.log('Alice votes aye')
    await signAndSend(api.tx.council.vote(hash, index, true), ALICE)
    console.log('Bob votes aye')
    await signAndSend(api.tx.council.vote(hash, index, true), BOB)
    console.log('Bob closes the motion')
    await signAndSend(api.tx.council.close(hash, index, 1000450000, 100), BOB)
}

/**
 * 1. Submit 3 council members: alice, bob & charlie;
 * 2. Dave votes for them
 * @param api
 */
const submitCouncilAndVote = async (api) => {
    const { ALICE, BOB, CHARLIE, DAVE } = getDevAccounts()
    const D125 = 125000000000
    console.log('submitCandidacy: alice')
    await signAndSend(api.tx.phragmenElection.submitCandidacy(0), ALICE)
    console.log('submitCandidacy: bob')
    await signAndSend(api.tx.phragmenElection.submitCandidacy(1), BOB)
    console.log('submitCandidacy: charlie')
    await signAndSend(api.tx.phragmenElection.submitCandidacy(2), CHARLIE)
    console.log('vote')
    await signAndSend(api.tx.phragmenElection.vote([ALICE.address, BOB.address, CHARLIE.address], D125), DAVE)
}

/**
 * Propose a proposal and reject
 * This function will fill the treasury pot to be able to fund some bounties
 * @param api
 */
const proposalsProposeAndReject = async (api) => {
    const { DAVE } = getDevAccounts()
    console.log('Dave proposes a proposal')
    await signAndSend(api.tx.treasury.proposeSpend('12500000000000000', DAVE.address), DAVE)
    const proposalIndex = (await api.query.treasury.proposalCount()).toHuman() - 1
    console.log(`Proposal index is: ${proposalIndex}`)

    const call = api.tx.treasury.rejectProposal(proposalIndex)
    await createMotionVoteAndClose(api, call)
}

/**
 * Propose a bounty and approve it
 * @param api
 */
const bountiesProposeAndAccept = async (api, description) => {
    const { DAVE } = getDevAccounts()
    console.log('Dave proposes a bounty to approve')
    await signAndSend(api.tx.bounties.proposeBounty(1250000000000, description), DAVE)
    const bountyIndex = (await api.query.bounties.bountyCount()).toHuman() - 1
    console.log(`Bounty index is: ${bountyIndex}`)

    const call = api.tx.bounties.approveBounty(bountyIndex)
    await createMotionVoteAndClose(api, call)
}

/**
 * Propose a curator and do not vote
 * @param api
 */
const bountiesProposeCurator = async (api, bountyIndex) => {
    const { DAVE, BOB } = getDevAccounts()
    console.log('Propose dave as a curator')

    const call = api.tx.bounties.proposeCurator(bountyIndex, DAVE.address, '125000000000')
    await signAndSend(api.tx.council.propose(2, call, 100), BOB)
}

/**
 * Propose a curator and accept it for a funded bounty
 * @param api
 */
const bountiesProposeCuratorAndVote = async (api, bountyIndex) => {
    const { DAVE } = getDevAccounts()
    console.log('Propose dave as a curator')

    const call = api.tx.bounties.proposeCurator(bountyIndex, DAVE.address, '125000000000')
    await createMotionVoteAndClose(api, call)
}

/**
 * Propose a very expensive bounty which should never get funded and approve it. It should stuck in "Approved" status
 * @param api
 */
const bountiesProposeAndAcceptVeryExpensive = async (api) => {
    const { DAVE } = getDevAccounts()
    console.log('Dave proposes a very expensive bounty')
    await signAndSend(api.tx.bounties.proposeBounty('1250000000000000000', 'expensive bounty to approve'), DAVE)
    const bountyIndex = (await api.query.bounties.bountyCount()).toHuman() - 1
    console.log(`Bounty index is: ${bountyIndex}`)

    const call = api.tx.bounties.approveBounty(bountyIndex)
    await createMotionVoteAndClose(api, call)
}

;(async () => {
    const polkadot = await getPolkadotApi()
    const args = process.argv.slice(2)
    console.log(args)

    if (args.length === 0 || args[0] === '1') {
        // step 1 - create a council. after executing wait until the candidates become members
        await submitCouncilAndVote(polkadot)
    } else if (args[0] === '2') {
        // step 2 - create and reject a proposal to fill in the pot and create some bounties (approved & funded)
        // after this step wait until one of the bounties gets funded (the spend period ends)
        await proposalsProposeAndReject(polkadot)
        await bountiesProposeAndAccept(polkadot, 'bounty to fund')
        await bountiesProposeAndAccept(polkadot, 'bounty to propose curator')
        await bountiesProposeAndAcceptVeryExpensive(polkadot)
    } else if (args[0] === '3') {
        // step 3 - propose curator and vote to have an funded bounty with curator voting and an active
        // after this step wait until one of the bounties gets funded (the spend period ends)
        await bountiesProposeCurator(polkadot, 1)
        await bountiesProposeCuratorAndVote(polkadot, 2)
    }

    process.exit(0)
})()

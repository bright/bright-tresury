import {BadRequestException, ForbiddenException, NotFoundException} from "@nestjs/common";
import {v4 as uuid} from 'uuid'
import {SessionUser} from "../../auth/session/session.decorator";
import {beforeSetupFullApp, cleanDatabase} from "../../utils/spec.helpers";
import {Idea} from "../entities/idea.entity";
import {IdeasService} from "../ideas.service";
import {IdeaStatus} from "../ideaStatus";
import {createIdea, createSessionUser} from "../spec.helpers";
import {CreateIdeaMilestoneDto} from "./dto/createIdeaMilestoneDto";
import {IdeaMilestoneNetwork} from "./entities/idea.milestone.network.entity";
import {IdeaMilestonesService} from "./idea.milestones.service";

describe(`/api/v1/ideas`, () => {

  const app = beforeSetupFullApp()
  const getIdeasService = () => app.get().get(IdeasService)
  const getIdeaMilestonesService = () => app.get().get(IdeaMilestonesService)

  let idea: Idea
  let sessionUser: SessionUser
  let otherUser: SessionUser

  beforeEach(async () => {
    await cleanDatabase()
    sessionUser = await createSessionUser()
    otherUser = await createSessionUser({username: 'other', email: 'other@example.com'})
    idea = await createIdea({
        title: 'ideaTitle',
        networks: [{name: 'polkadot', value: 100}]
      }, sessionUser, getIdeasService())
  })

  describe('find', () => {

    it('should throw not found exception for not existing idea', async () => {
      await expect(getIdeaMilestonesService().find(uuid(), sessionUser))
          .rejects
          .toThrow(NotFoundException)
    })

    it('should return empty array for idea without milestones', async () => {
      const ideaMilestones = await getIdeaMilestonesService().find(idea.id, sessionUser)
      expect(ideaMilestones.length).toBe(0)
    })

    it('should return idea milestones for idea with added milestones', async () => {
      const createIdeaMilestoneDto: CreateIdeaMilestoneDto = {
          subject: 'ideaMilestoneSubject',
          networks: [{name: 'polkadot', value: 100}],
          dateFrom: null,
          dateTo: null,
          description: null
      }

      await getIdeaMilestonesService().create(idea.id, createIdeaMilestoneDto, sessionUser)
      await getIdeaMilestonesService().create(idea.id, createIdeaMilestoneDto, sessionUser)

      const ideaMilestones = await getIdeaMilestonesService().find(idea.id, sessionUser)

      expect(ideaMilestones.length).toBe(2)
    })

    it('should return idea milestones only for the given idea', async () => {

      const anotherIdea = await createIdea({ title: 'anotherIdeaTitle', networks: [{name: 'polkadot', value: 100}]}, sessionUser)

      await getIdeaMilestonesService().create(
          idea.id,
          new CreateIdeaMilestoneDto(
              'ideaMilestoneSubject1',
              [{name: 'polkadot', value: 100}],
              null,
              null,
              null
          ),
          sessionUser
      )
      await getIdeaMilestonesService().create(
          anotherIdea.id,
          new CreateIdeaMilestoneDto(
              'ideaMilestoneSubject2',
              [{name: 'polkadot', value: 100}],
              null,
              null,
              null
          ),
          sessionUser
      )

      const ideaMilestones = await getIdeaMilestonesService().find(idea.id, sessionUser)

      expect(ideaMilestones.length).toBe(1)
      expect(ideaMilestones[0].subject).toBe('ideaMilestoneSubject1')
    })

    it('should return idea milestones for draft idea for owner', async () => {
      const draftIdea = await createIdea({ title: 'draftIdeaTitle', networks: [{name: 'polkadot', value: 100}], status: IdeaStatus.Draft}, sessionUser)
      await getIdeaMilestonesService().create(
          draftIdea.id,
          new CreateIdeaMilestoneDto(
              'draftIdeaMilestoneSubject1',
              [{name: 'polkadot', value: 100}],
              null,
              null,
              null
          ),
          sessionUser
      )
      const result = await getIdeaMilestonesService().find(draftIdea.id, sessionUser)
      expect(result.length).toBe(1)
      expect(result[0].subject).toBe('draftIdeaMilestoneSubject1')
    })

    it('should throw not found for draft idea for not owner', async () => {
      const draftIdea = await createIdea({ title: 'draftIdeaTitle', networks: [{name: 'polkadot', value: 100}], status: IdeaStatus.Draft}, sessionUser)

      await expect(getIdeaMilestonesService().findOne(draftIdea.id, otherUser))
          .rejects
          .toThrow(NotFoundException)
    })

  })

  describe('findOne', () => {

    it('should throw not found exception for not existing idea milestone', async () => {
      await expect(getIdeaMilestonesService().findOne(uuid(), sessionUser))
          .rejects
          .toThrow(NotFoundException)
    })

    it('should return existing idea milestone', async () => {

      const createIdeaMilestoneDto = new CreateIdeaMilestoneDto(
          'ideaMilestoneSubject',
          [{name: 'polkadot', value: 50}, {name: 'kusama', value: 100}],
          new Date(2021, 3, 20),
          new Date(2021, 3, 21),
          'ideaMilestoneDescription'
      )

      const createdIdeaMilestone = await getIdeaMilestonesService().create(
          idea.id,
          createIdeaMilestoneDto,
          sessionUser
      )

      const foundIdeaMilestone = await getIdeaMilestonesService().findOne(createdIdeaMilestone.id, sessionUser)

      expect(foundIdeaMilestone.subject).toBe('ideaMilestoneSubject')
      expect(foundIdeaMilestone.networks).toBeDefined()
      expect(foundIdeaMilestone.networks.length).toBe(2)
      expect(foundIdeaMilestone.networks.find((n: IdeaMilestoneNetwork) => n.name === 'kusama')).toBeDefined()
      expect(foundIdeaMilestone.networks.find((n: IdeaMilestoneNetwork) => n.name === 'polkadot')).toBeDefined()
      expect(foundIdeaMilestone.dateFrom).toBe('2021-04-20')
      expect(foundIdeaMilestone.dateTo).toBe('2021-04-21')
      expect(foundIdeaMilestone.description).toBe('ideaMilestoneDescription')
      expect(foundIdeaMilestone.ordinalNumber).toBeDefined()
    })

    it('should return idea milestone for draft idea for owner', async () => {
      const draftIdea = await createIdea({ title: 'draftIdeaTitle', networks: [{name: 'polkadot', value: 100}], status: IdeaStatus.Draft}, sessionUser)
      const milestone = await getIdeaMilestonesService().create(
          draftIdea.id,
          new CreateIdeaMilestoneDto(
              'draftIdeaMilestoneSubject1',
              [{name: 'polkadot', value: 100}],
              null,
              null,
              null
          ),
          sessionUser
      )
      const result = await getIdeaMilestonesService().findOne(milestone.id, sessionUser)
      expect(result).toBeDefined()
      expect(result.subject).toBe('draftIdeaMilestoneSubject1')
    })

    it('should throw not found for draft idea for not owner', async () => {
      const draftIdea = await createIdea({ title: 'draftIdeaTitle', networks: [{name: 'polkadot', value: 100}], status: IdeaStatus.Draft}, sessionUser)

      await expect(getIdeaMilestonesService().findOne(draftIdea.id, otherUser))
          .rejects
          .toThrow(NotFoundException)
    })

  })

  describe('create', () => {

    const minimalCreateIdeaMilestoneDto = new CreateIdeaMilestoneDto(
        'ideaMilestoneSubject',
        [{name: 'polkadot', value: 100}],
        null,
        null,
        null
    )

    it('should throw bad request exception if start and end dates of idea milestone are given and end date is prior to start date', async () => {
      await expect(getIdeaMilestonesService().create(idea.id, new CreateIdeaMilestoneDto(
        'ideaMilestoneSubject',
          [{name: 'polkadot', value: 100}],
          new Date(2021, 3, 21),
          new Date(2021, 3, 20),
          'ideaMilestoneDescription'
      ), sessionUser))
          .rejects
          .toThrow(BadRequestException)
    })

    it ('should create and save an idea milestone', async () => {
      const createdIdeaMilestone = await getIdeaMilestonesService().create(idea.id, minimalCreateIdeaMilestoneDto, sessionUser)
      const foundIdeaMilestone = await getIdeaMilestonesService().findOne(createdIdeaMilestone.id, sessionUser)

      expect(foundIdeaMilestone).toBeDefined()
    })

    it('should add auto generated ordinal number', async () => {
      const createdIdeaMilestone = await getIdeaMilestonesService().create(idea.id, minimalCreateIdeaMilestoneDto, sessionUser)
      const foundIdeaMilestone = await getIdeaMilestonesService().findOne(createdIdeaMilestone.id, sessionUser)

      expect(foundIdeaMilestone.ordinalNumber).toBeDefined()
    })

    it('should auto increment ordinal number', async () => {
      const firstCreatedIdeaMilestone = await getIdeaMilestonesService().create(idea.id, minimalCreateIdeaMilestoneDto, sessionUser)
      const secondCreatedIdeaMilestone = await getIdeaMilestonesService().create(idea.id, minimalCreateIdeaMilestoneDto, sessionUser)

      expect(secondCreatedIdeaMilestone.ordinalNumber).toBe(firstCreatedIdeaMilestone.ordinalNumber + 1)
    })

    it('should create and save idea milestone with all valid data', async () => {
      const createdIdeaMilestone = await getIdeaMilestonesService().create(idea.id,
          new CreateIdeaMilestoneDto(
              'ideaMilestoneSubject',
              [{name: 'polkadot', value: 100}],
              new Date(2021, 3, 20),
              new Date(2021, 3, 21),
              'ideaMilestoneDescription'
          ), sessionUser
      )

      const foundIdeaMilestone = await getIdeaMilestonesService().findOne(createdIdeaMilestone.id, sessionUser)

      expect(foundIdeaMilestone.subject).toBe('ideaMilestoneSubject')
      expect(foundIdeaMilestone.networks).toBeDefined()
      expect(foundIdeaMilestone.networks.length).toBe(1)
      expect(foundIdeaMilestone.networks.find((n: IdeaMilestoneNetwork) => n.name === 'polkadot')).toBeDefined()
      expect(foundIdeaMilestone.dateFrom).toBe('2021-04-20')
      expect(foundIdeaMilestone.dateTo).toBe('2021-04-21')
      expect(foundIdeaMilestone.description).toBe('ideaMilestoneDescription')
      expect(foundIdeaMilestone.ordinalNumber).toBeDefined()
    })

    it('should throw forbidden for not owner', async () => {
      await expect(getIdeaMilestonesService().create(idea.id,
          new CreateIdeaMilestoneDto(
              'ideaMilestoneSubject',
              [{name: 'polkadot', value: 100}],
              new Date(2021, 3, 20),
              new Date(2021, 3, 21),
              'ideaMilestoneDescription'
          ), otherUser))
          .rejects
          .toThrow(ForbiddenException)
    })

  })

  describe('update', () => {

    it('should throw not found if wrong id', async () => {
      await expect(getIdeaMilestonesService().update(uuid(), { }, sessionUser))
          .rejects
          .toThrow(NotFoundException)
    })

    it('should throw bad request exception if updated end date of the milestone is prior to start date', async () => {
      const ideaMilestone = await getIdeaMilestonesService().create(
          idea.id,
          new CreateIdeaMilestoneDto(
              'ideaMilestoneSubject',
              [{name: 'polkadot', value: 100}],
              new Date(2021, 3, 20),
              new Date(2021, 3, 21),
              'ideaMilestoneDescription'
          ), sessionUser
      )

      await expect(getIdeaMilestonesService().update(
          ideaMilestone.id, { dateTo: new Date(2021, 3, 19)}, sessionUser))
          .rejects
          .toThrow(BadRequestException)
    })

    it('should update and save idea milestone with updated subject', async () => {
      const ideaMilestone = await getIdeaMilestonesService().create(
          idea.id,
          new CreateIdeaMilestoneDto(
              'ideaMilestoneSubject',
              [{name: 'polkadot', value: 100}],
              new Date(),
              new Date(),
              'ideaMilestoneDescription'
          ), sessionUser
      )

      await getIdeaMilestonesService().update(ideaMilestone.id, { subject: 'Updated subject' }, sessionUser)

      const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id, sessionUser)

      expect(updatedIdeaMilestone.subject).toBe('Updated subject')
    })

    it('should update and save idea milestone with updated subject and not change other data', async () => {
      const ideaMilestone = await getIdeaMilestonesService().create(
          idea.id,
          new CreateIdeaMilestoneDto(
              'ideaMilestoneSubject',
              [{name: 'polkadot', value: 100}],
              new Date(2021, 3, 20),
              new Date(2021, 3, 21),
              'ideaMilestoneDescription'
          ), sessionUser
      )

      await getIdeaMilestonesService().update(ideaMilestone.id, { subject: 'Updated description' }, sessionUser)

      const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id, sessionUser)

      expect(updatedIdeaMilestone.subject).toBe('Updated description')
      expect(updatedIdeaMilestone.networks).toBeDefined()
      expect(updatedIdeaMilestone.networks.length).toBe(1)
      expect(updatedIdeaMilestone.networks[0].name).toBe('polkadot')
      expect(updatedIdeaMilestone.networks[0].value).toBe('100.000000000000000')
      expect(updatedIdeaMilestone.dateFrom).toBe('2021-04-20')
      expect(updatedIdeaMilestone.dateTo).toBe('2021-04-21')
      expect(updatedIdeaMilestone.description).toBe('ideaMilestoneDescription')
      expect(updatedIdeaMilestone.ordinalNumber).toBe(ideaMilestone.ordinalNumber)
    })

    it(`should update and save idea milestone with updated network's value`, async () => {
      const ideaMilestone = await getIdeaMilestonesService().create(
          idea.id,
          new CreateIdeaMilestoneDto(
              'ideaMilestoneSubject',
              [{name: 'polkadot', value: 100}],
              null,
              null,
              'ideaMilestoneDescription'
          ), sessionUser
      )

      await getIdeaMilestonesService().update(ideaMilestone.id, {
        networks: [
          {
            ...ideaMilestone.networks[0],
            value: 999
          }
        ]
      }, sessionUser)

      const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id, sessionUser)

      expect(updatedIdeaMilestone.networks).toBeDefined()
      expect(updatedIdeaMilestone.networks.length).toBe(1)
      expect(updatedIdeaMilestone.networks[0].name).toBe('polkadot')
      expect(updatedIdeaMilestone.networks[0].value).toBe(`999.000000000000000`)
    })

    it(`should update and save idea milestone with updated network's name`, async () => {
      const ideaMilestone = await getIdeaMilestonesService().create(
          idea.id,
          new CreateIdeaMilestoneDto(
              'ideaMilestoneSubject',
              [{name: 'polkadot', value: 100}],
              null,
              null,
              'ideaMilestoneDescription'
          ), sessionUser
      )

      await getIdeaMilestonesService().update(ideaMilestone.id, {
        networks: [
          {
            ...ideaMilestone.networks[0],
            name: 'updatedNetworkName'
          }
        ]
      }, sessionUser)

      const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id, sessionUser)

      expect(updatedIdeaMilestone.networks).toBeDefined()
      expect(updatedIdeaMilestone.networks.length).toBe(1)
      expect(updatedIdeaMilestone.networks[0].name).toBe('updatedNetworkName')
      expect(updatedIdeaMilestone.networks[0].value).toBe('100.000000000000000')
    })

    it(`should update and save idea milestone with a new network added`, async () => {
      const ideaMilestone = await getIdeaMilestonesService().create(
          idea.id,
          new CreateIdeaMilestoneDto(
              'ideaMilestoneSubject',
              [{name: 'polkadot', value: 100}],
              null,
              null,
              'ideaMilestoneDescription'
          ), sessionUser
      )

      await getIdeaMilestonesService().update(ideaMilestone.id, {
        networks: [
            ...ideaMilestone.networks,
            {
              name: 'kusama',
              value: 150
            }
        ]
      }, sessionUser)

      const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id, sessionUser)

      expect(updatedIdeaMilestone.networks).toBeDefined()
      expect(updatedIdeaMilestone.networks.length).toBe(2)

      const firstNetwork = updatedIdeaMilestone.networks.find(({ name }: IdeaMilestoneNetwork) => name === 'polkadot')
      const secondNetwork = updatedIdeaMilestone.networks.find(({ name }: IdeaMilestoneNetwork) => name === 'kusama')

      expect(firstNetwork).toBeDefined()
      expect(firstNetwork!.value).toBe('100.000000000000000')

      expect(secondNetwork).toBeDefined()
      expect(secondNetwork!.value).toBe('150.000000000000000')
    })

    it(`should update and save idea milestone with one network removed`, async () => {
      const ideaMilestone = await getIdeaMilestonesService().create(
          idea.id,
          new CreateIdeaMilestoneDto(
              'ideaMilestoneSubject',
              [{name: 'polkadot', value: 100}, {name: 'kusama', value: 150}],
              null,
              null,
              'ideaMilestoneDescription'
          ), sessionUser
      )

      const ideaMilestoneNetworkToRemain = ideaMilestone.networks.find(({ name }: IdeaMilestoneNetwork) => name === 'polkadot')!

      await getIdeaMilestonesService().update(ideaMilestone.id, {
        networks: [
          ideaMilestoneNetworkToRemain
        ]
      }, sessionUser)

      const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id, sessionUser)

      expect(updatedIdeaMilestone.networks).toBeDefined()
      expect(updatedIdeaMilestone.networks.length).toBe(1)
      expect(updatedIdeaMilestone.networks[0].name).toBe('polkadot')
      expect(updatedIdeaMilestone.networks[0].value).toBe('100.000000000000000')
    })

    it(`should update and save idea milestone with all networks removed`, async () => {
      const ideaMilestone = await getIdeaMilestonesService().create(
          idea.id,
          new CreateIdeaMilestoneDto(
              'ideaMilestoneSubject',
              [{name: 'polkadot', value: 100}],
              null,
              null,
              'ideaMilestoneDescription'
          ), sessionUser
      )

      await getIdeaMilestonesService().update(ideaMilestone.id, {
        networks: []
      }, sessionUser)

      const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id, sessionUser)

      expect(updatedIdeaMilestone.networks).toBeDefined()
      expect(updatedIdeaMilestone.networks.length).toBe(0)
    })

    it('should update and save idea milestone with updated dateFrom', async () => {
      const ideaMilestone = await getIdeaMilestonesService().create(
          idea.id,
          new CreateIdeaMilestoneDto(
              'ideaMilestoneSubject',
              [{name: 'polkadot', value: 100}],
              new Date(2021, 3, 20),
              new Date(2021, 3, 21),
              'ideaMilestoneDescription'
          ), sessionUser
      )

      await getIdeaMilestonesService().update(ideaMilestone.id, { dateFrom: new Date(2021, 3, 19) }, sessionUser)

      const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id, sessionUser)

      expect(updatedIdeaMilestone.dateFrom).toBe('2021-04-19')
    })

    it('should update and save idea milestone with updated dateTo', async () => {
      const ideaMilestone = await getIdeaMilestonesService().create(
          idea.id,
          new CreateIdeaMilestoneDto(
              'ideaMilestoneSubject',
              [{name: 'polkadot', value: 100}],
              new Date(2021, 3, 20),
              new Date(2021, 3, 21),
              'ideaMilestoneDescription'
          ), sessionUser
      )

      await getIdeaMilestonesService().update(ideaMilestone.id, { dateTo: new Date(2021, 3, 22) }, sessionUser)

      const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id, sessionUser)

      expect(updatedIdeaMilestone.dateTo).toBe('2021-04-22')
    })

    it('should update and save idea milestone with updated description', async () => {
      const ideaMilestone = await getIdeaMilestonesService().create(
          idea.id,
          new CreateIdeaMilestoneDto(
              'ideaMilestoneSubject',
              [{name: 'polkadot', value: 100}],
              null,
              null,
              'ideaMilestoneDescription'
          ), sessionUser
      )

      await getIdeaMilestonesService().update(ideaMilestone.id, { description: 'Updated description' }, sessionUser)
      const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id, sessionUser)

      expect(updatedIdeaMilestone.description).toBe('Updated description')
    })

    it('should throw forbidden for not owner', async () => {
      const ideaMilestone = await getIdeaMilestonesService().create(
          idea.id,
          new CreateIdeaMilestoneDto(
              'ideaMilestoneSubject',
              [{name: 'polkadot', value: 100}],
              null,
              null,
              'ideaMilestoneDescription'
          ), sessionUser
      )
      await expect(getIdeaMilestonesService().update(ideaMilestone.id, { description: 'Updated description' }, otherUser))
          .rejects
          .toThrow(ForbiddenException)
    })
  })

})

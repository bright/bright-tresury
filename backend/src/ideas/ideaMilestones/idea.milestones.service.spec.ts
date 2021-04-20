import {IdeaMilestonesService} from "./idea.milestones.service";
import {beforeSetupFullApp, cleanDatabase} from "../../utils/spec.helpers";
import {IdeasService} from "../ideas.service";
import {Idea} from "../entities/idea.entity";
import {createIdea} from "../spec.helpers";
import {CreateIdeaMilestoneDto} from "./dto/createIdeaMilestoneDto";
import {v4 as uuid} from 'uuid'
import {NotFoundException} from "@nestjs/common";
import {IdeaMilestoneNetwork} from "./entities/idea.milestone.network.entity";
import {addDays, format, subDays} from "date-fns";
import {IdeaMilestone} from "./entities/idea.milestone.entity";

const formatIdeaMilestoneDate = (date: Date) => format(date, 'yyyy-MM-dd')

describe(`/api/v1/ideas`, () => {

  const app = beforeSetupFullApp()
  const getIdeasService = () => app.get().get(IdeasService)
  const getIdeaMilestonesService = () => app.get().get(IdeaMilestonesService)

  let idea: Idea

  beforeEach(async () => {
    await cleanDatabase()
    idea = await createIdea({
        title: 'ideaTitle',
        networks: [{name: 'polkadot', value: 100}]
      }, getIdeasService())
  })

  describe('find', () => {

    it('should throw not found exception for not existing idea', async () => {
      await expect(getIdeaMilestonesService().find(uuid()))
          .rejects
          .toThrow(NotFoundException)
    })

    it('should return empty array for idea without milestones', async () => {
      const ideaMilestones = await getIdeaMilestonesService().find(idea.id)
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

      await getIdeaMilestonesService().create(idea.id, createIdeaMilestoneDto)
      await getIdeaMilestonesService().create(idea.id, createIdeaMilestoneDto)

      const ideaMilestones = await getIdeaMilestonesService().find(idea.id)

      expect(ideaMilestones.length).toBe(2)
    })

    it('should return idea milestones only for the given idea', async () => {

      const anotherIdea = await createIdea({ title: 'anotherIdeaTitle', networks: [{name: 'polkadot', value: 100}]})

      await getIdeaMilestonesService().create(
          idea.id,
          new CreateIdeaMilestoneDto(
              'ideaMilestoneSubject1',
              [{name: 'polkadot', value: 100}],
              null,
              null,
              null
          )
      )
      await getIdeaMilestonesService().create(
          anotherIdea.id,
          new CreateIdeaMilestoneDto(
              'ideaMilestoneSubject2',
              [{name: 'polkadot', value: 100}],
              null,
              null,
              null
          )
      )

      const ideaMilestones = await getIdeaMilestonesService().find(idea.id)

      expect(ideaMilestones.length).toBe(1)
      expect(ideaMilestones[0].subject).toBe('ideaMilestoneSubject1')
    })

  })

  describe('findOne', () => {

    it('should throw not found exception for not existing idea milestone', async () => {
      await expect(getIdeaMilestonesService().findOne(uuid()))
          .rejects
          .toThrow(NotFoundException)
    })

    it('should return existing idea milestone', async () => {

      const createIdeaMilestoneDto = new CreateIdeaMilestoneDto(
          'ideaMilestoneSubject',
          [{name: 'polkadot', value: 50}, {name: 'kusama', value: 100}],
          new Date(),
          new Date(),
          'ideaMilestoneDescription'
      )

      const createdIdeaMilestone = await getIdeaMilestonesService().create(
          idea.id,
          createIdeaMilestoneDto
      )

      const foundIdeaMilestone = await getIdeaMilestonesService().findOne(createdIdeaMilestone.id)

      expect(foundIdeaMilestone.subject).toBe(createdIdeaMilestone.subject)
      expect(foundIdeaMilestone.networks).toBeDefined()
      expect(foundIdeaMilestone.networks.length).toBe(2)
      expect(foundIdeaMilestone.networks.find((n: IdeaMilestoneNetwork) => n.name === 'kusama')).toBeDefined()
      expect(foundIdeaMilestone.networks.find((n: IdeaMilestoneNetwork) => n.name === 'polkadot')).toBeDefined()
      expect(foundIdeaMilestone.dateFrom).toBe(formatIdeaMilestoneDate(createIdeaMilestoneDto.dateFrom!))
      expect(foundIdeaMilestone.dateTo).toBe(formatIdeaMilestoneDate(createIdeaMilestoneDto.dateTo!))
      expect(foundIdeaMilestone.description).toBe(createIdeaMilestoneDto.description)
      expect(foundIdeaMilestone.ordinalNumber).toBeDefined()
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

    it ('should create and save an idea milestone', async () => {
      const createdIdeaMilestone = await getIdeaMilestonesService().create(idea.id, minimalCreateIdeaMilestoneDto)
      const foundIdeaMilestone = await getIdeaMilestonesService().findOne(createdIdeaMilestone.id)

      expect(foundIdeaMilestone).toBeDefined()
    })

    it('should add auto generated ordinal number', async () => {
      const createdIdeaMilestone = await getIdeaMilestonesService().create(idea.id, minimalCreateIdeaMilestoneDto)
      const foundIdeaMilestone = await getIdeaMilestonesService().findOne(createdIdeaMilestone.id)

      expect(foundIdeaMilestone.ordinalNumber).toBeDefined()
    })

    it('should auto increment ordinal number', async () => {
      const firstCreatedIdeaMilestone = await getIdeaMilestonesService().create(idea.id, minimalCreateIdeaMilestoneDto)
      const secondCreatedIdeaMilestone = await getIdeaMilestonesService().create(idea.id, minimalCreateIdeaMilestoneDto)

      expect(secondCreatedIdeaMilestone.ordinalNumber).toBe(firstCreatedIdeaMilestone.ordinalNumber + 1)
    })

    it('should create and save idea milestone with all valid data', async () => {

      const fullCreateIdeaMilestoneDto = new CreateIdeaMilestoneDto(
          'ideaMilestoneSubject',
          [{name: 'polkadot', value: 100}],
          new Date(),
          new Date(),
          'ideaMilestoneDescription'
      )

      const createdIdeaMilestone = await getIdeaMilestonesService().create(idea.id, fullCreateIdeaMilestoneDto)

      const foundIdeaMilestone = await getIdeaMilestonesService().findOne(createdIdeaMilestone.id)

      expect(foundIdeaMilestone.subject).toBe(fullCreateIdeaMilestoneDto.subject)
      expect(foundIdeaMilestone.networks).toBeDefined()
      expect(foundIdeaMilestone.networks.length).toBe(1)
      expect(foundIdeaMilestone.networks.find((n: IdeaMilestoneNetwork) => n.name === 'polkadot')).toBeDefined()
      expect(foundIdeaMilestone.dateFrom).toBe(formatIdeaMilestoneDate(fullCreateIdeaMilestoneDto.dateFrom!))
      expect(foundIdeaMilestone.dateTo).toBe(formatIdeaMilestoneDate(fullCreateIdeaMilestoneDto.dateTo!))
      expect(foundIdeaMilestone.description).toBe(fullCreateIdeaMilestoneDto.description)
      expect(foundIdeaMilestone.ordinalNumber).toBeDefined()
    })

  })

  describe('update', () => {

    let ideaMilestone: IdeaMilestone

    beforeEach(async () => {
      ideaMilestone = await getIdeaMilestonesService().create(
          idea.id,
          new CreateIdeaMilestoneDto(
            'ideaMilestoneSubject',
            [{name: 'polkadot', value: 100}],
            new Date(),
            new Date(),
            'ideaMilestoneDescription'
          )
      )
    })

    it('should throw not found if wrong id', async () => {
      await expect(getIdeaMilestonesService().update(uuid(), { }))
          .rejects
          .toThrow(NotFoundException)
    })

    it('should update and save idea milestone with updated subject', async () => {
      const subject = 'Updated subject'

      await getIdeaMilestonesService().update(ideaMilestone.id, { subject })
      const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id)

      expect(updatedIdeaMilestone.subject).toBe(subject)
    })

    it('should update and save idea milestone with updated subject and not change other data', async () => {
      const subject = 'Updated description'

      await getIdeaMilestonesService().update(ideaMilestone.id, { subject })
      const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id)

      expect(updatedIdeaMilestone.subject).toBe(subject)
      expect(updatedIdeaMilestone.networks).toBeDefined()
      expect(updatedIdeaMilestone.networks.length).toBe(1)
      expect(updatedIdeaMilestone.networks[0].name).toBe(ideaMilestone.networks[0].name)
      expect(updatedIdeaMilestone.networks[0].value).toBe(ideaMilestone.networks[0].value)
      expect(updatedIdeaMilestone.dateFrom).toBe(ideaMilestone.dateFrom)
      expect(updatedIdeaMilestone.dateTo).toBe(ideaMilestone.dateTo)
      expect(updatedIdeaMilestone.description).toBe(ideaMilestone.description)
      expect(updatedIdeaMilestone.ordinalNumber).toBe(ideaMilestone.ordinalNumber)
    })

    it('should update and save idea milestone with updated networks', async () => {
      const value = 999

      await getIdeaMilestonesService().update(ideaMilestone.id, {
        networks: [
          {
            ...ideaMilestone.networks[0],
            value
          }
        ]
      })

      const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id)

      expect(updatedIdeaMilestone.networks).toBeDefined()
      expect(updatedIdeaMilestone.networks.length).toBe(1)
      expect(updatedIdeaMilestone.networks[0].name).toBe(ideaMilestone.networks[0].name)
      expect(updatedIdeaMilestone.networks[0].value).toBe(`${value}.000000000000000`)
    })

    it('should update and save idea milestone with updated dateFrom', async () => {
      const dateFrom = subDays(new Date(ideaMilestone.dateFrom!), 3)
      const formattedDateFrom = formatIdeaMilestoneDate(dateFrom)

      await getIdeaMilestonesService().update(ideaMilestone.id, { dateFrom })
      const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id)

      expect(updatedIdeaMilestone.dateFrom).toBe(formattedDateFrom)
    })

    it('should update and save idea milestone with updated dateTo', async () => {
      const dateTo = addDays(new Date(ideaMilestone.dateTo!), 3)
      const formattedDateTo = formatIdeaMilestoneDate(dateTo)

      await getIdeaMilestonesService().update(ideaMilestone.id, { dateTo })
      const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id)

      expect(updatedIdeaMilestone.dateTo).toBe(formattedDateTo)
    })

    it('should update and save idea milestone with updated description', async () => {
      const description = 'Updated description'

      await getIdeaMilestonesService().update(ideaMilestone.id, { description })
      const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id)

      expect(updatedIdeaMilestone.description).toBe(description)
    })

  })

})

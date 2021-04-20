import {beforeSetupFullApp, cleanDatabase, request} from "../../utils/spec.helpers";
import {Idea} from "../entities/idea.entity";
import {createIdea, createIdeaMilestone} from "../spec.helpers";
import {IdeasService} from "../ideas.service";
import {CreateIdeaMilestoneDto} from "./dto/createIdeaMilestoneDto";
import {IdeaMilestoneDto} from "./dto/ideaMilestoneDto";
import {IdeaMilestonesService} from "./idea.milestones.service";
import {addDays, format, subDays} from 'date-fns'
import {HttpStatus} from "@nestjs/common";
import {v4 as uuid, validate as uuidValidate} from 'uuid';
import {IdeaMilestone} from "./entities/idea.milestone.entity";

const baseUrl = (ideaId: string) => `/api/v1/ideas/${ideaId}/milestones`

const formatIdeaMilestoneDate = (date: Date) => format(date, 'yyyy-MM-dd')

describe('/api/v1/ideas/:ideaId/milestones', () => {

  const app = beforeSetupFullApp()
  const getIdeasService = () => app.get().get(IdeasService)
  const getIdeaMilestonesService = () => app.get().get(IdeaMilestonesService)

  let idea: Idea

  beforeEach(async () => {
    await cleanDatabase()
    idea = await createIdea({ title: 'ideaTitle' }, getIdeasService())
  })

  describe('GET', () => {

    it(`should return ${HttpStatus.OK} for the existing idea`, async () => {
      return request(app())
          .get(baseUrl(idea.id))
          .expect(HttpStatus.OK)
    })

    it(`should return ${HttpStatus.NOT_FOUND} for not existing idea`, async () => {
      const notExistingIdeaUuid = uuid()

      return request(app())
          .get(baseUrl(notExistingIdeaUuid))
          .expect(HttpStatus.NOT_FOUND)
    })

    it ('should return empty array for idea without milestones', async () => {
      const result = await request(app())
          .get(baseUrl(idea.id))

      const body = result.body as IdeaMilestoneDto[]

      expect(body.length).toBe(0)
    })

    it ('should return idea milestones', async () => {
      const ideaMilestone = await createIdeaMilestone(
          idea.id,
          new CreateIdeaMilestoneDto('ideaMilestoneSubject', [], null, null, null),
          getIdeaMilestonesService()
      )

      const result = await request(app())
          .get(baseUrl(idea.id))

      const body = result.body as IdeaMilestoneDto[]

      expect(body.length).toBe(1)
      expect(body[0].subject).toBe(ideaMilestone.subject)
    })

    it ('should return milestones only of the given idea', async () => {
      const ideaMilestone = await createIdeaMilestone(
          idea.id,
          new CreateIdeaMilestoneDto('ideaMilestoneSubject', [], null, null, null),
          getIdeaMilestonesService()
      )

      const anotherIdea = await createIdea({ title: 'anotherIdeaTitle'}, getIdeasService())
      await createIdeaMilestone(
          anotherIdea.id,
          new CreateIdeaMilestoneDto('anotherIdeaMilestoneSubject', [], null, null, null),
          getIdeaMilestonesService()
      )

      const result = await request(app())
          .get(baseUrl(idea.id))

      const body = result.body as IdeaMilestoneDto[]

      expect(body.length).toBe(1)
      expect(body[0].subject).toBe(ideaMilestone.subject)
    })

    it ('should return milestones containing correct data', async () => {

      const date = new Date()

      const ideaMilestone = await createIdeaMilestone(
          idea.id,
          new CreateIdeaMilestoneDto(
              'ideaMilestoneSubject',
              [{ name: 'polkadot', value: 100 }],
              date,
              date,
              'ideaMilestoneDescription'
          ),
          getIdeaMilestonesService()
      )

      const result = await request(app())
          .get(baseUrl(idea.id))

      const body = result.body as IdeaMilestoneDto[]

      expect(body.length).toBe(1)
      expect(body[0].subject).toBe(ideaMilestone.subject)
      expect(body[0].networks.length).toBe(1)
      expect(body[0].networks[0].name).toBe(ideaMilestone.networks[0].name)
      expect(body[0].networks[0].value).toBe(Number(ideaMilestone.networks[0].value))
      expect(body[0].dateFrom).toBe(ideaMilestone.dateFrom)
      expect(body[0].dateTo).toBe(ideaMilestone.dateTo)
      expect(body[0].description).toBe(ideaMilestone.description)
    })

  })

  describe('POST', () => {

      it(`should return ${HttpStatus.BAD_REQUEST} if subject is not given`, () => {
          return request(app())
              .post(baseUrl(idea.id))
              .send({
                  networks: [{name: 'polkadot', value: 10}],
                  dateFrom: null,
                  dateTo: null,
                  description: null
              })
              .expect(HttpStatus.BAD_REQUEST)
      })

      it(`should return ${HttpStatus.BAD_REQUEST} if subject is null`, () => {
          return request(app())
              .post(baseUrl(idea.id))
              .send({
                  subject: null,
                  networks: [{name: 'polkadot', value: 10}],
                  dateFrom: null,
                  dateTo: null,
                  description: null
              })
              .expect(HttpStatus.BAD_REQUEST)
      })

      it(`should return ${HttpStatus.BAD_REQUEST} if subject is empty`, () => {
          return request(app())
              .post(baseUrl(idea.id))
              .send({
                  subject: '',
                  networks: [{name: 'polkadot', value: 10}],
                  dateFrom: null,
                  dateTo: null,
                  description: null
              })
              .expect(HttpStatus.BAD_REQUEST)
      })

      it(`should return ${HttpStatus.BAD_REQUEST} if networks are not given`, () => {
          return request(app())
              .post(baseUrl(idea.id))
              .send({
                  subject: 'ideaMilestoneSubject',
                  dateFrom: null,
                  dateTo: null,
                  description: null
              })
              .expect(HttpStatus.BAD_REQUEST)
      })

      it(`should return ${HttpStatus.BAD_REQUEST} if networks are empty array`, () => {
          return request(app())
              .post(baseUrl(idea.id))
              .send({
                  subject: 'ideaMilestoneSubject',
                  networks: [],
                  dateFrom: null,
                  dateTo: null,
                  description: null
              })
              .expect(HttpStatus.BAD_REQUEST)
      })

      it(`should return ${HttpStatus.BAD_REQUEST} if network name is not given`, () => {
          return request(app())
              .post(baseUrl(idea.id))
              .send({
                  subject: 'ideaMilestoneSubject',
                  networks: [{value: 10}],
                  dateFrom: null,
                  dateTo: null,
                  description: null
              })
              .expect(HttpStatus.BAD_REQUEST)
      })

      it(`should return ${HttpStatus.BAD_REQUEST} if network name is null`, () => {
          return request(app())
              .post(baseUrl(idea.id))
              .send({
                  subject: 'ideaMilestoneSubject',
                  networks: [{name: null, value: 10}],
                  dateFrom: null,
                  dateTo: null,
                  description: null
              })
              .expect(HttpStatus.BAD_REQUEST)
      })

      it(`should return ${HttpStatus.BAD_REQUEST} if network value is not given`, () => {
          return request(app())
              .post(baseUrl(idea.id))
              .send({
                  subject: 'ideaMilestoneSubject',
                  networks: [{name: 'polkadot'}],
                  dateFrom: null,
                  dateTo: null,
                  description: null
              })
              .expect(HttpStatus.BAD_REQUEST)
      })

      it(`should return ${HttpStatus.BAD_REQUEST} if network value is null`, () => {
          return request(app())
              .post(baseUrl(idea.id))
              .send({
                  subject: 'ideaMilestoneSubject',
                  networks: [{name: 'polkadot', value: null}],
                  dateFrom: null,
                  dateTo: null,
                  description: null
              })
              .expect(HttpStatus.BAD_REQUEST)
      })

      it(`should return ${HttpStatus.BAD_REQUEST} if network value is not a number`, () => {
          return request(app())
              .post(baseUrl(idea.id))
              .send({
                  subject: 'ideaMilestoneSubject',
                  networks: [{name: 'polkadot', value: 'value'}],
                  dateFrom: null,
                  dateTo: null,
                  description: null
              })
              .expect(HttpStatus.BAD_REQUEST)
      })

      it(`should return ${HttpStatus.BAD_REQUEST} if dateFrom is given but has incorrect format`, () => {
          return request(app())
              .post(baseUrl(idea.id))
              .send({
                  subject: 'ideaMilestoneSubject',
                  networks: [{name: 'polkadot', value: 100}],
                  dateFrom: 'incorrect_format',
                  dateTo: null,
                  description: null
              })
              .expect(HttpStatus.BAD_REQUEST)
      })

      it(`should return ${HttpStatus.BAD_REQUEST} if dateTo is given but has incorrect format`, () => {
          return request(app())
              .post(baseUrl(idea.id))
              .send({
                  subject: 'ideaMilestoneSubject',
                  networks: [{name: 'polkadot', value: 100}],
                  dateFrom: null,
                  dateTo: 'incorrect_format',
                  description: null
              })
              .expect(HttpStatus.BAD_REQUEST)
      })

      it(`should return ${HttpStatus.CREATED} if the minimal required data is given`, () => {
          return request(app())
              .post(baseUrl(idea.id))
              .send({
                  subject: 'ideaMilestoneSubject',
                  networks: [{name: 'polkadot', value: 10}],
                  dateFrom: null,
                  dateTo: null,
                  description: null
              })
              .expect(HttpStatus.CREATED)
      })

      it(`should return ${HttpStatus.CREATED} if all correct data is given`, () => {
          return request(app())
              .post(baseUrl(idea.id))
              .send({
                  subject: 'ideaMilestoneSubject',
                  networks: [{name: 'polkadot', value: 10}],
                  dateFrom: new Date(),
                  dateTo: new Date(),
                  description: 'ideaDescription'
              })
              .expect(HttpStatus.CREATED)
      })

      it(`should return created idea milestone if all correct data is given`, async () => {
          const subject = 'ideaMilestoneSubject'
          const networks = [{name: 'polkadot', value: 10}]
          const date = new Date()
          const formattedDate = formatIdeaMilestoneDate(date)
          const description = 'ideaDescription'

          const response = await request(app())
              .post(baseUrl(idea.id))
              .send({
                  subject,
                  networks,
                  dateFrom: date,
                  dateTo: date,
                  description
              })
              .expect(HttpStatus.CREATED)

          const body = response.body as IdeaMilestoneDto

          expect(uuidValidate(body.id)).toBe(true)
          expect(body.ordinalNumber).toBeDefined()
          expect(body.subject).toBe(subject)
          expect(body.networks.length).toBe(1)
          expect(body.networks[0].name).toBe(networks[0].name)
          expect(body.networks[0].value).toBe(Number(networks[0].value))
          expect(body.dateFrom).toBe(formattedDate)
          expect(body.dateTo).toBe(formattedDate)
          expect(body.description).toBe(description)
      })

  })

  describe('PATCH', () => {

    let ideaMilestone: IdeaMilestone

    beforeEach(async () => {
        ideaMilestone = await createIdeaMilestone(
            idea.id,
            new CreateIdeaMilestoneDto(
                'ideaMilestoneSubject',
                [{name: 'polkadot', value: 100}],
                new Date(),
                new Date(),
                'ideaMilestoneDescription'
            ),
            getIdeaMilestonesService()
        )
    })

    it(`should return ${HttpStatus.NOT_FOUND} if incorrect idea milestone id is given`, () => {
        const incorrectIdeaMilestoneId = uuid()

        return request(app())
            .patch(`${baseUrl(idea.id)}/${incorrectIdeaMilestoneId}`)
            .send({ })
            .expect(HttpStatus.NOT_FOUND)
    })

    it(`should patch subject correctly`, async () => {
        const newSubject = 'notEmptySubject'

        const response = await request(app())
            .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
            .send({
                subject: newSubject
            })
            .expect(HttpStatus.OK)

        const body = response.body as IdeaMilestoneDto

        expect(body.subject).toBe(newSubject)
    })

    it(`should patch networks correctly`, async () => {

        const newNetworkValue = 500

        const response = await request(app())
            .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
            .send({
                networks: [
                    {
                      ...ideaMilestone.networks[0],
                      value: newNetworkValue
                  }
              ]
            })
            .expect(HttpStatus.OK)

        const body = response.body as IdeaMilestoneDto

        expect(body.networks).toBeDefined()
        expect(body.networks[0].name).toBe(ideaMilestone.networks[0].name)
        expect(body.networks[0].value).toBe(newNetworkValue)
    })

    it(`should patch dateFrom correctly`, async () => {

        const newDateFrom = subDays(new Date(ideaMilestone.dateFrom!), 3)
        const newDateFromFormatted = formatIdeaMilestoneDate(newDateFrom)

        const response = await request(app())
              .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
              .send({
                  dateFrom: newDateFrom
              })
              .expect(HttpStatus.OK)

        const body = response.body as IdeaMilestoneDto

        expect(body.dateFrom).toBe(newDateFromFormatted)
    })

    it(`should patch dateTo correctly`, async () => {

        const newDateTo = addDays(new Date(ideaMilestone.dateFrom!), 3)
        const newDateToFormatted = formatIdeaMilestoneDate(newDateTo)

        const response = await request(app())
              .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
              .send({
                  dateTo: newDateTo
              })
              .expect(HttpStatus.OK)

        const body = response.body as IdeaMilestoneDto

        expect(body.dateTo).toBe(newDateToFormatted)
    })

    it(`should patch description correctly`, async () => {

        const newDescription = 'newDescription'

        const response = await request(app())
              .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
              .send({
                  description: newDescription
              })
              .expect(HttpStatus.OK)

        const body = response.body as IdeaMilestoneDto

        expect(body.description).toBe(newDescription)
    })

    it(`should not change data which was not patched`, async () => {

        const newSubject = 'newSubject'

        const response = await request(app())
              .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
              .send({
                  subject: newSubject
              })
              .expect(HttpStatus.OK)

        const body = response.body as IdeaMilestoneDto

        expect(body.ordinalNumber).toBe(ideaMilestone.ordinalNumber)
        expect(body.subject).toBe(newSubject)
        expect(body.networks.length).toBe(ideaMilestone.networks.length)
        expect(body.networks[0].name).toBe(ideaMilestone.networks[0].name)
        expect(body.networks[0].value).toBe(Number(ideaMilestone.networks[0].value))
        expect(body.dateFrom).toBe(ideaMilestone.dateFrom)
        expect(body.dateTo).toBe(ideaMilestone.dateTo)
        expect(body.description).toBe(ideaMilestone.description)
    })

  })

});

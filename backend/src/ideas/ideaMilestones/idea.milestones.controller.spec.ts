import {beforeSetupFullApp, cleanDatabase, request} from "../../utils/spec.helpers";
import {Idea} from "../entities/idea.entity";
import {createIdea, createIdeaMilestone} from "../spec.helpers";
import {IdeasService} from "../ideas.service";
import {CreateIdeaMilestoneDto} from "./dto/createIdeaMilestoneDto";
import {IdeaMilestoneDto} from "./dto/ideaMilestoneDto";
import {IdeaMilestonesService} from "./idea.milestones.service";
import {HttpStatus} from "@nestjs/common";
import {v4 as uuid, validate as uuidValidate} from 'uuid';
import {IdeaMilestone} from "./entities/idea.milestone.entity";

const baseUrl = (ideaId: string) => `/api/v1/ideas/${ideaId}/milestones`

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
      await createIdeaMilestone(
          idea.id,
          new CreateIdeaMilestoneDto('ideaMilestoneSubject', [], null, null, null),
          getIdeaMilestonesService()
      )

      const result = await request(app())
          .get(baseUrl(idea.id))

      const body = result.body as IdeaMilestoneDto[]

      expect(body.length).toBe(1)
      expect(body[0].subject).toBe('ideaMilestoneSubject')
    })

    it ('should return milestones only of the given idea', async () => {
      await createIdeaMilestone(
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
      expect(body[0].subject).toBe('ideaMilestoneSubject')
    })

    it ('should return milestones containing correct data', async () => {
      await createIdeaMilestone(
          idea.id,
          new CreateIdeaMilestoneDto(
              'ideaMilestoneSubject',
              [{ name: 'polkadot', value: 100 }],
              new Date(2021, 3, 20),
              new Date(2021, 3, 21),
              'ideaMilestoneDescription'
          ),
          getIdeaMilestonesService()
      )

      const result = await request(app())
          .get(baseUrl(idea.id))

      const body = result.body as IdeaMilestoneDto[]

      expect(body.length).toBe(1)
      expect(body[0].subject).toBe('ideaMilestoneSubject')
      expect(body[0].networks.length).toBe(1)
      expect(body[0].networks[0].name).toBe('polkadot')
      expect(body[0].networks[0].value).toBe(100)
      expect(body[0].dateFrom).toBe('2021-04-20')
      expect(body[0].dateTo).toBe('2021-04-21')
      expect(body[0].description).toBe('ideaMilestoneDescription')
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
                  dateFrom: '2021-04-20',
                  dateTo: '2021-04-21',
                  description: 'ideaDescription'
              })
              .expect(HttpStatus.CREATED)
      })

      it(`should return created idea milestone if all correct data is given`, async () => {
          const response = await request(app())
              .post(baseUrl(idea.id))
              .send({
                  subject: 'ideaMilestoneSubject',
                  networks: [{name: 'polkadot', value: 10}],
                  dateFrom: '2021-04-20',
                  dateTo: '2021-04-21',
                  description: 'ideaDescription'
              })
              .expect(HttpStatus.CREATED)

          const body = response.body as IdeaMilestoneDto

          expect(uuidValidate(body.id)).toBe(true)
          expect(body.ordinalNumber).toBeDefined()
          expect(body.subject).toBe('ideaMilestoneSubject')
          expect(body.networks.length).toBe(1)
          expect(body.networks[0].name).toBe('polkadot')
          expect(body.networks[0].value).toBe(10)
          expect(body.dateFrom).toBe('2021-04-20')
          expect(body.dateTo).toBe('2021-04-21')
          expect(body.description).toBe('ideaDescription')
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
                new Date(2021, 3, 20),
                new Date(2021, 3, 21),
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
        const response = await request(app())
            .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
            .send({
                subject: 'notEmptySubject'
            })
            .expect(HttpStatus.OK)

        const body = response.body as IdeaMilestoneDto

        expect(body.subject).toBe('notEmptySubject')
    })

    it(`should patch networks correctly`, async () => {
        const response = await request(app())
            .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
            .send({
                networks: [
                    {
                      ...ideaMilestone.networks[0],
                      value: 500
                  }
              ]
            })
            .expect(HttpStatus.OK)

        const body = response.body as IdeaMilestoneDto

        expect(body.networks).toBeDefined()
        expect(body.networks[0].name).toBe('polkadot')
        expect(body.networks[0].value).toBe(500)
    })

    it(`should patch dateFrom correctly`, async () => {
        const response = await request(app())
              .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
              .send({
                  dateFrom: '2021-04-19'
              })
              .expect(HttpStatus.OK)

        const body = response.body as IdeaMilestoneDto

        expect(body.dateFrom).toBe('2021-04-19')
    })

    it(`should patch dateTo correctly`, async () => {
        const response = await request(app())
              .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
              .send({
                  dateTo: '2021-04-22'
              })
              .expect(HttpStatus.OK)

        const body = response.body as IdeaMilestoneDto

        expect(body.dateTo).toBe('2021-04-22')
    })

    it(`should patch description correctly`, async () => {
        const response = await request(app())
              .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
              .send({
                  description: 'newDescription'
              })
              .expect(HttpStatus.OK)

        const body = response.body as IdeaMilestoneDto

        expect(body.description).toBe('newDescription')
    })

    it(`should not change data which was not patched`, async () => {
        const response = await request(app())
              .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
              .send({
                  subject: 'newSubject'
              })
              .expect(HttpStatus.OK)

        const body = response.body as IdeaMilestoneDto

        expect(body.ordinalNumber).toBe(ideaMilestone.ordinalNumber)
        expect(body.subject).toBe('newSubject')
        expect(body.networks.length).toBe(1)
        expect(body.networks[0].name).toBe('polkadot')
        expect(body.networks[0].value).toBe(100)
        expect(body.dateFrom).toBe('2021-04-20')
        expect(body.dateTo).toBe('2021-04-21')
        expect(body.description).toBe('ideaMilestoneDescription')
    })

  })

});

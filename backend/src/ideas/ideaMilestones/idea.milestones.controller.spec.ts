import {beforeSetupFullApp, cleanDatabase, request} from "../../utils/spec.helpers";
// import {IdeasService} from "../ideas.service";
// import {createIdea} from "../spec.helpers";

const baseUrl = () => `/api/v1/ideas`

describe('/api/v1/ideas/:ideaId/milestones', () => {

  const app = beforeSetupFullApp()
  // const getService = () => app.get().get(IdeasService)

  beforeEach(async () => {
    await cleanDatabase()
  })

  describe('GET', () => {

    it('should return 200', async () => {

      // const idea = await createIdea({title: 'Test title'}, getService())

      return request(app())
          .get(baseUrl())
          .expect(200)
    })

    it('should return 200', async () => {

      // const idea = await createIdea({title: 'Test title'}, getService())

      return request(app())
          .get(baseUrl())
          .expect(200)
    })

    it('should return 200', async () => {

      // const idea = await createIdea({title: 'Test title'}, getService())

      return request(app())
          .get(baseUrl())
          .expect(200)
    })

  })

});

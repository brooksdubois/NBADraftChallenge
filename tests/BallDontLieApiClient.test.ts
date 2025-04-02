import BallDontLieApiClient from "../src/BallDontLieApiClient";

const dbApiClient = new BallDontLieApiClient("abcdToken")

describe("Testing the dbAPIClient's data processing", () => {

})

describe("Testing the dpApiClient's fetches", () => {
    let fetchMock: any = undefined;

    beforeEach(() => {
        fetchMock = jest.spyOn(global, "fetch").mockImplementation();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
})
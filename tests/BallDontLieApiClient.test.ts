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

    test('fetch players has been called with the correct token', () => {
        dbApiClient.fetchPlayersAtCursorByTeam(1, 123);
        expect(fetchMock).toHaveBeenCalled();
        const headers = {"headers": {"Authorization": "Bearer abcdToken", "accept": "application/json"}, "method": "GET"};
        const expectedURL = `${dbApiClient.baseURL}/players?per_page=100&team_ids[]=1&cursor=123`;
        expect(fetchMock).toHaveBeenCalledWith(expectedURL, headers);
    });

    test('fetch teams has been called with the correct token', () => {
        dbApiClient.fetchTeams();
        expect(fetchMock).toHaveBeenCalled();
        const headers = {"headers": {"Authorization": "Bearer abcdToken", "accept": "application/json"}, "method": "GET"};
        const expectedURL = `${dbApiClient.baseURL}/teams`;
        expect(fetchMock).toHaveBeenCalledWith(expectedURL, headers);
    });
})
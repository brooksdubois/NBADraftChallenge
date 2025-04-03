import BallDontLieApiClient, {TeamById} from "../src/BallDontLieApiClient";
import {StubFetchAdapter} from "./StubFetchAdapter";

const dbApiClient = new BallDontLieApiClient("abcdToken")

const sampleTeamResponse = [
    {
        "id": 1,
        "teamName": "Atlanta Hawks",
    },
    {
        "id": 2,
        "teamName": "Boston Celtics",
    }
]

const samplePlayersResponses = {
    1: {
        "data": [
            {
                "draft_round": 1,
            },
            {
                "draft_round": 2,
            },
            {
                "draft_round": 3,
            }
        ],
        "meta": {
            "next_cursor": 46399178
        }
    },
    "1next": {
        "data": [
            {
                "draft_round": 1,
            },
            {
                "draft_round": 1,
            },
            {
                "draft_round": 2,
            }
        ],
        "meta": { }
    },
    2 : {
        "data": [
            {
                "draft_round": 3,
            }
        ],
        "meta": {}
    }
}

describe("Testing the dbAPIClient's data processing", () => {

    test('fetch by teams triggers subsequent requests', () => {
        const fetchMock = new StubFetchAdapter(samplePlayersResponses)
        const ballApiClient = new BallDontLieApiClient("abcdToken", fetchMock)
        ballApiClient.fetchAllPlayersForAllTeams(sampleTeamResponse as [TeamById])
        expect(fetchMock.urlCalledWith).toContain('https://api.balldontlie.io/v1/players?per_page=100&team_ids[]=1');
        expect(fetchMock.urlCalledWith).toContain('https://api.balldontlie.io/v1/players?per_page=100&team_ids[]=2');
    });

})


describe("Testing the dpApiClient's fetches provide the correct tokens", () => {
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
        const headers = {"headers": {"Authorization": "abcdToken", "accept": "application/json"}, "method": "GET"};
        const expectedURL = `${dbApiClient.baseURL}/players?per_page=100&team_ids[]=1&cursor=123`;
        expect(fetchMock).toHaveBeenCalledWith(expectedURL, headers);
    });

    test('fetch teams has been called with the correct token', () => {
        dbApiClient.fetchTeams();
        expect(fetchMock).toHaveBeenCalled();
        const headers = {"headers": {"Authorization": "abcdToken", "accept": "application/json"}, "method": "GET"};
        const expectedURL = `${dbApiClient.baseURL}/teams`;
        expect(fetchMock).toHaveBeenCalledWith(expectedURL, headers);
    });
})
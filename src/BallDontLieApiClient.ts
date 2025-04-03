import * as R from 'ramda';

interface Player {
    draft_round: string,
}

interface PlayerMeta {
    next_cursor?: number
}

interface PlayersResponse {
    data: [Player],
    meta: PlayerMeta
}

interface Team {
    id: number,
    full_name: string,
}

interface TeamsResponse {
    data:[Team]
}


export default class BallDontLieApiClient {
    fetchOptions: object
    baseURL = "https://api.balldontlie.io/v1";

    constructor(apiKey: string) {
        this.fetchOptions = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: apiKey
            }
        };
    }

    fetchAllPlayersForTeam = async (teamId: number) => {
        let responseCursor: number = null;
        let allPlayers = []
        do {
            const fetchedPlayers = await this.fetchPlayersAtCursorByTeam(teamId, responseCursor)
            allPlayers.push(fetchedPlayers.data.map(it => it.draft_round))
            responseCursor = fetchedPlayers.meta.next_cursor
        }while(responseCursor !== undefined)
        return R.pipe(
            R.flatten,
            R.countBy(R.identity)
        )(allPlayers);
    }

    fetchPlayersAtCursorByTeam = async (teamId: number, cursor?: number) => {
        let playerUrl = `${this.baseURL}/players?per_page=100&team_ids[]=${teamId}`;
        if(cursor) playerUrl += `&cursor=${cursor}`
        const playerPaginatedResponse = await fetch(playerUrl, this.fetchOptions);
        return await playerPaginatedResponse?.json() as PlayersResponse
    }

    fetchTeams = async () => {
        const teamUrl = `${this.baseURL}/teams`;
        const teamResponse = await fetch(teamUrl, this.fetchOptions);
        const teamJson = await teamResponse?.json() as TeamsResponse
        return teamJson?.data
    }
}
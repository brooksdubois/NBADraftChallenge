import * as R from 'ramda';

interface TeamById {
    id: number,
    teamName: string
}

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

    fetchAllPlayersForAllTeams = (allTeams: [TeamById]) =>
        Promise.all(
            allTeams.map(async (team) => {
                const draftPicks = await this.fetchAllPlayersForTeam(team.id);
                return {
                    teamName: team.teamName,
                    draftRounds: draftPicks,
                };
            })
        );

    fetchAllPlayersForTeam = async (teamId: number) => {
        let responseCursor: number = null;
        let allPlayers = []
        //loop through all the responses, paginating and collecting data
        do {
            const fetchedPlayers = await this.fetchPlayersAtCursorByTeam(teamId, responseCursor)
            allPlayers.push(fetchedPlayers.data.map(it => it.draft_round))
            responseCursor = fetchedPlayers.meta.next_cursor
        }while(responseCursor !== undefined)
        //flatten into an array of counts by draft round
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
        const teamsById = teamJson?.data.map(it => ({ id: it.id, teamName: it.full_name }))
        return teamsById as [TeamById]
    }
}
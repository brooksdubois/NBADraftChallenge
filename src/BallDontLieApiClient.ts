import * as R from 'ramda';
import {FetchAdapter} from "./FetchAdapter";

export interface TeamById {
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
    fetchAdapter: FetchAdapter = new FetchAdapter()

    constructor(apiKey: string, fetchAdapter?: FetchAdapter | null) {
        this.fetchOptions = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: apiKey
            }
        };
        if(fetchAdapter) this.fetchAdapter = fetchAdapter
    }

    fetchAllPlayersForAllTeams = async (allTeams: [TeamById]) => {
        //this api can't seem to handle all of these paginated requests at once, so I'm using
        //allSettled here and filtering out all the rejected requests for this exercise
        const resolvedPromises = await Promise.allSettled(
            allTeams.map(async (team) => {
                //fetch our draft picks for this team
                const draftRounds = await this.fetchAllPlayersForTeam(team.id);
                return { //customize response
                    teamName: team.teamName,
                    draftRounds: draftRounds,
                };
            })
        );
        return resolvedPromises
            .filter(it => it.status === 'fulfilled')
            .map(it => it.value);
    }

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
        const playerPaginatedResponse = await this.fetchAdapter.fetch(playerUrl, this.fetchOptions);
        return await playerPaginatedResponse?.json() as PlayersResponse
    }

    fetchTeams = async () => {
        const teamUrl = `${this.baseURL}/teams`;
        const teamResponse = await this.fetchAdapter.fetch(teamUrl, this.fetchOptions);
        const teamJson = await teamResponse?.json() as TeamsResponse
        const teamsById = teamJson?.data.map(it => ({ id: it.id, teamName: it.full_name }))
        return teamsById as [TeamById]
    }
}
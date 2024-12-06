export interface Message {
    type: "game_state";
    data: GameState;
}

export interface GameState {
    party?: Pokemon[];
    // todo: party can't be larger than 6 pokemon
}

export interface Pokemon {
    // probably will be the "Secret ID"
    // https://bulbapedia.bulbagarden.net/wiki/Trainer_ID_number#Generation_II
    id: number;
    // original trainer id
    otid: number;

    speciesName: string;

    name: string;
    level: number;
}
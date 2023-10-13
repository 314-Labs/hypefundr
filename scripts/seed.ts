import * as edgedb from "edgedb";


import e from '../dbschema/edgeql-js';
import { fields, limit, sort, where, twitchAccessToken, igdb } from 'ts-igdb-client'
import * as fs from 'fs';
import { pipeline } from 'stream';
import fetch from 'node-fetch'
import { promisify } from 'util'
const dbClient = edgedb.createClient();

const twitchSecrets = {
    client_id: "cp8eedx8g2n9mqmf5jrttn0jsumahw",
    client_secret: "pq2i7cf88rmgl0qd6lpzq1pyupr0sl",
}

// generate a twitch access token
const accessToken = await twitchAccessToken(twitchSecrets);

// generate an IGDB client with twitch credentials
const igdbClient = igdb(twitchSecrets.client_id, accessToken);

// Helper functions below
async function fetchGames() {
    const response = await igdbClient.request('games').pipe(
        fields('*'),
        where('rating_count', '!=', null),
        sort('rating_count', 'desc'),
        limit(5)
    ).execute();
    return response.data;
}

async function downloadImage(coverUrl: string, filename: string) {
    const response = await fetch(coverUrl);
    await promisify(fs.mkdir)(filename.substring(0, filename.lastIndexOf('/')));
    const fileStream = fs.createWriteStream(filename);
    await promisify(pipeline)(response.body!, fileStream);
}

async function uploadImage(filename: string, remoteName: string) {
    const file = fs.readFileSync(filename);
    await this.bunny.upload(filename, file, 'image/jpeg');
}

function delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}


// Start of actual script

const games = await fetchGames();

for (const game of games) {
    const { data: coverData } = await igdbClient.request('covers').pipe(
        fields('*'),
        where('id', '=', game.cover!),
    ).execute();

    const coverUrl = "https:" + coverData[0].url!.replace('t_thumb', 't_original');

    const query = e.insert(e.Game, {
        title: game.name!,
        igdb_id: game.id!,
        poster_image: coverUrl
    });

    console.log(`Inserting ${game.name!}`);
    let result = await query.run(dbClient);

    // const fileName = `images/${result.id}/cover.jpg`; 
    // console.log(game.name, '\t\t\t', game.rating_count);

    // await this.downloadImage(coverUrl, fileName);

    // await this.uploadImage(fileName, fileName);     
    await delay(1000);

}

console.log("Inserting system accounts");

await e.insert(e.BillingAccount, {
    name: "Stripe Checkout",
    can_go_negative: true,
    special_account_type: e.SpecialAccount.StripeCheckout
}).run(dbClient);

await e.insert(e.BillingAccount, {
    name: "Stripe Connect",
    can_go_negative: false,
    special_account_type: e.SpecialAccount.StripeConnect
}).run(dbClient);
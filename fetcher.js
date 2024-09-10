import axios from 'axios';
import { choice, maxBy, repeatedLcs, sample  } from './util';

// Using Open Opus API http://openopus.org/
class OpenOpusFetcher {
    static baseUrl = 'https://api.openopus.org/';

    // Number signifies number of composers in that epoch.
    static epochs = [
        'Medieval', // 3
        'Renaissance', // 7
        'Baroque', // 8
        'Classical', // 3
        'Early Romantic', // 3
        'Romantic', // 18
        'Late Romantic', // 9
        '20th Century', // 18
        'Post-War', // 7
        '21st Century', // 1
    ];

    static async fetchCorrectAndDecoys() {
        async function fetchComposerObjs() {
            const composersMethod = 'composer/list/rec.json'; // rec.json for well-known composers.
            const response = await axios.get(OpenOpusFetcher.baseUrl + composersMethod);
            return response.data.composers;
        }

        const composers = await fetchComposerObjs();
        const [_, correctComposerObj] = choice(composers); // correctComposerObj: correct composer object.

        const correctComposerName = correctComposerObj.complete_name;
        const correctComposerId = correctComposerObj.id;
        const epochA = correctComposerObj.epoch;

        // Get epochB, which is adjacent to correct composer's epoch, epoch A.
        const epochIndex = OpenOpusFetcher.epochs.indexOf(epochA);
        const isLastEpoch = epochIndex == OpenOpusFetcher.epochs.length - 1;
        const epochB = OpenOpusFetcher.epochs[isLastEpoch ? epochIndex - 1 : epochIndex + 1];

        // Get 3 decoy composers from both epoch A and epoch B, making sure that
        // decoy is different from correct.
        const decoyCount = 3;
        const composersFromA = composers.filter((composer) => composer.epoch == epochA && composer.id != correctComposerId);
        const composersFromB = composers.filter((composer) => composer.epoch == epochB);
        const decoyObjs = sample([...composersFromA, ...composersFromB], decoyCount);

        return [correctComposerId, correctComposerName, decoyObjs.map(obj => obj.complete_name)];
    }

    static async fetchRandomWork(composerId) {
        function fetchWorks(composerId) {
            const searchMethod = `work/list/composer/${composerId}/genre/all.json`;
            return axios.get(OpenOpusFetcher.baseUrl + searchMethod);
        }
        const works = (await fetchWorks(composerId)).data.works;
        const [, work] = choice(works);
        return work.title;
    }
}

class SpotifyFetcher {
    static baseUrl = 'https://api.spotify.com';

    static token = '';

    // Returns [workTitle, preview url, spotify entire song url].
    // This is because some works do not have preview urls in Spotify,
    // so the workTitleQuery is not necessarily equal to workTitle.
    static async fetchAudioUrlsWithToken(composerName, workTitleQuery, token) {
        const query = `${workTitleQuery} by ${composerName}`;
        const searchMethod = '/v1/search';
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: query,
                type: 'track',
                limit: 50
            }
        };
        const response = await axios.get(SpotifyFetcher.baseUrl + searchMethod, config);
        const items = response.data.tracks.items;

        // Check that audio URL we are fetching has a reference to the artist with `composerName`. 
        // This check increases the chances of getting the correct audio URL.
        function composerLastNameCheck(item, composerName) {
            function removeDiatrics(str) {
                return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            }
            for (const artist of item.artists) {
                if (removeDiatrics(artist.name).includes(removeDiatrics(composerName))) {
                    return true;
                }
            }
            return false;
        }

        const potentialItems = []

        for (const item of items) {
            if (item.preview_url && composerLastNameCheck(item, composerName)) {
                potentialItems.push(item)
            }
        }

        // Get the item that has the most similar name to the work title.
        if (potentialItems.length > 0) {
            const item = maxBy(potentialItems, item => repeatedLcs(item.name, workTitleQuery))
            return [item.preview_url, item.external_urls.spotify, item.name];
        }

        return null; // Could not find any preview URLs for that query with the correct composer.
    }

    static async refreshToken() {
        const response = await axios.get('https://v4m134dlpi.execute-api.us-west-2.amazonaws.com/refreshSpotifyAuthToken');
        console.log(response.data);
        SpotifyFetcher.token = response.data;
    }

    static async fetchAudioUrls(composerName, workTitle) {
        try {
            const audioUrls = await this.fetchAudioUrlsWithToken(composerName, workTitle, SpotifyFetcher.token);
            return audioUrls;
        } catch {
            console.log("Fetching new token");
            await SpotifyFetcher.refreshToken();
            const audioUrls = await this.fetchAudioUrlsWithToken(composerName, workTitle, SpotifyFetcher.token);
            return audioUrls;
        }
    }
}

export class Fetcher {
    async fetch() {
        while (true) {
            const [correctId, correct, decoys] = await OpenOpusFetcher.fetchCorrectAndDecoys();
            const workTitle = await OpenOpusFetcher.fetchRandomWork(correctId);
            const spotifyResponse = await SpotifyFetcher.fetchAudioUrls(correct, workTitle);
            if (spotifyResponse) {
                return [...spotifyResponse, correct, decoys]; 
            }
            // Retry the whole thing, because Spotify has no preview URL for that piece.
        }
    }
}

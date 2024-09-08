import axios from 'axios'
import { choice, sample } from './randomArrayOps'

// Using Open Opus API http://openopus.org/
class OpenOpusFetcher {
    static baseUrl = 'https://api.openopus.org/'

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
    ]

    static async fetchCorrectAndDecoys() {
        async function fetchComposerObjs() {
            const composersMethod = 'composer/list/rec.json' // rec.json for well-known composers.
            const response = await axios.get(OpenOpusFetcher.baseUrl + composersMethod)
            return response.data.composers
        }

        const composers = await fetchComposerObjs()
        const [_, correctComposerObj] = choice(composers) // correctComposerObj: correct composer object.

        const correctComposerName = correctComposerObj.name
        const correctComposerId = correctComposerObj.id
        const epochA = correctComposerObj.epoch

        // Get epochB, which is adjacent to correct composer's epoch, epoch A.
        const epochIndex = OpenOpusFetcher.epochs.indexOf(epochA)
        const isLastEpoch = epochIndex == OpenOpusFetcher.epochs.length - 1
        const epochB = OpenOpusFetcher.epochs[isLastEpoch ? epochIndex - 1 : epochIndex + 1]

        // Get 3 decoy composers from both epoch A and epoch B, making sure that
        // decoy is different from correct.
        const decoyCount = 3
        const composersFromA = composers.filter((composer) => composer.epoch == epochA && composer.id != correctComposerId)
        const composersFromB = composers.filter((composer) => composer.epoch == epochB)
        const decoyObjs = sample([...composersFromA, ...composersFromB], decoyCount)

        return [correctComposerId, correctComposerName, decoyObjs.map(obj => obj.name)]
    }

    static async fetchRandomWork(composerId) {
        function fetchWorks(composerId, type) {
            const searchMethod = `work/list/composer/${composerId}/genre/${type == 'rec' ? 'Recommended' : 'all'}.json`
            return axios.get(OpenOpusFetcher.baseUrl + searchMethod)
        }
        const works = (await fetchWorks(composerId, 'rec')).data.works ?? (await fetchWorks(composerId, 'all')).data.works
        const [, work] = choice(works)
        return work.title
    }
}

class SpotifyFetcher {
    static baseUrl = 'https://api.spotify.com'

    static token = ''

    static async fetchAudioUrlWithToken(composerName, workTitle, token) {
        const query = `${workTitle} by ${composerName}`
        const searchMethod = '/v1/search'
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: query,
                type: 'track'
            }
        }
        const response = await axios.get(SpotifyFetcher.baseUrl + searchMethod, config)
        const items = response.data.tracks.items

        // Check that audio URL we are fetching has a reference to the artist with `composerName`. 
        // This check increases the chances of getting the correct audio URL.
        function composerLastNameCheck(item, composerName) {
            for (const artist of item.artists) {
                if (artist.name.includes(composerName)) {
                    return true
                }
            }
            return false
        }

        for (const item of items) {
            if (item.preview_url && composerLastNameCheck(item, composerName)) {
                return item.preview_url
            }
        }
    }

    static async refreshToken() {
        const response = await axios.get('https://v4m134dlpi.execute-api.us-west-2.amazonaws.com/refreshSpotifyAuthToken')
        console.log(response.data)
        SpotifyFetcher.token = response.data
    }

    static async fetchAudioUrl(composerName, workTitle) {
        try {
            const audioUrl = await this.fetchAudioUrlWithToken(composerName, workTitle, SpotifyFetcher.token)
            return audioUrl
        } catch {
            console.log("Fetching new token")
            await SpotifyFetcher.refreshToken()
            const audioUrl = await this.fetchAudioUrlWithToken(composerName, workTitle, SpotifyFetcher.token)
            return audioUrl
        }
    }
}

export class Fetcher {
    async fetch() {
        const [correctId, correct, decoys] = await OpenOpusFetcher.fetchCorrectAndDecoys()
        const workTitle = await OpenOpusFetcher.fetchRandomWork(correctId)
        const audioUrl = await SpotifyFetcher.fetchAudioUrl(correct, workTitle)
        return [audioUrl, workTitle, correct, decoys]
    }
}

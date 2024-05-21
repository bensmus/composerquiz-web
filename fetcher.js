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
        // Fetch all composers from an epoch.
        async function fetchComposers(epoch) {
            const composersMethod = 'composer/list/rec.json' // rec.json for well-known composers.
            const response = await axios.get(OpenOpusFetcher.baseUrl + composersMethod)
            return response.data.composers.filter((composer) => composer.epoch == epoch)
        }

        // Fetch 4 composers from a random epoch,
        // or if there are not 4 composers in that epoch,
        // take a minimal amount of composers from an adjacent epoch.
        async function fetchFourComposers() {
            const [epochIndex, epoch] = choice(OpenOpusFetcher.epochs)
            let composerObjs = await fetchComposers(epoch)
            const fetchAdj = composerObjs.length < 4
            if (fetchAdj) { // Need to fetch composers from adjacent epoch.
                let composerObjsAdjEpoch;
                if (epochIndex == OpenOpusFetcher.epochs.length - 1) {
                    composerObjsAdjEpoch = await fetchComposers(OpenOpusFetcher.epochs[OpenOpusFetcher.epochs.length - 2])
                } else {
                    composerObjsAdjEpoch = await fetchComposers(OpenOpusFetcher.epochs[epochIndex + 1])
                }
                composerObjs = [...composerObjs, ...composerObjsAdjEpoch]
            }
            return sample(composerObjs, 4)
        }

        const [correctObj, ...decoyObjs] = await fetchFourComposers()
        const correctId = correctObj.id
        const correct = correctObj.name
        const decoys = decoyObjs.map(obj => obj.name)
        return [correctId, correct, decoys]
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

    static async fetchAudioUrl(composerName, workTitle) {
        const query = `${workTitle} by ${composerName}`
        const searchMethod = '/v1/search'
        const config = {
            headers: {
                Authorization: `Bearer ${SpotifyFetcher.token}`
            },
            params: {
                q: query,
                type: 'track'
            }
        }
        const response = await axios.get(SpotifyFetcher.baseUrl + searchMethod, config)
        const tracks = response.data.tracks.items

        for (const track of tracks) {
            if (track.preview_url) {
                return track.preview_url
            }
        }
    }

    static get token() {
        // TODO
        return "BQCdbsIwWLE6t_BFlgkfQynJE4nKXwkwLWrB415CDFlN3f8_azJhdjXgbo5dEEQZGTGjKtkTf4qNYn1Gm3jv1xTLqriwmD2foYvL9rE3AYru509qncM"
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

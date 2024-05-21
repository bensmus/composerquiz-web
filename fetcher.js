import axios from 'axios'

// Using Open Opus API http://openopus.org/
class OpenOpusFetcher {
    static baseUrl = 'https://api.openopus.org/'

    static epochs = [
        'Medieval',
        'Renaissance',
        'Baroque',
        'Classical',
        'Early Romantic',
        'Romantic',
        'Late Romantic',
        '20th Century',
        'Post-War',
        '21st Century',
    ]

    // Fetch 4 composers from a random epoch,
    // or if there are not 4 composers in that epoch,
    // take a minimal amount of composers from an adjacent epoch.
    static async fetchFourComposers() {
        // Fetch all composers from an epoch.
        async function fetchComposers(epoch) {
            const composersMethod = 'composer/list/rec.json' // rec.json for well-known composers.
            const response = await axios.get(OpenOpusFetcher.baseUrl + composersMethod)
            return response.data.composers.filter((composer) => composer.epoch == epoch)
        }

        // FIXME
        const romantic = await fetchComposers('Romantic')
        const composerObjs = romantic.slice(0, 4)
        const [correctObj, ...decoyObjs] = composerObjs
        // console.log(decoyObjs)
        const correctId = correctObj.id
        const correct = correctObj.name
        const decoys = decoyObjs.map(obj => obj.name)
        return [correctId, correct, decoys]
    }

    static fetchRandomWork(composerId) {
        // FIXME
        return 'Gigue'
    }
}

export class Fetcher {

    async fetch() {
        const [correctId, correct, decoys] = await OpenOpusFetcher.fetchFourComposers()
        const workTitle = OpenOpusFetcher.fetchRandomWork(correctId)
        const audioUrl = 'https://p.scdn.co/mp3-preview/97dac628da05e44a4c7050bc8e5e2078af590e90?cid=66a3d2ff0264486bb7e5e495cc712271'
        return [audioUrl, workTitle, correct, decoys]
    }
}

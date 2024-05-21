export class Fetcher {
    fetch() {
        const audioUrl = 'https://p.scdn.co/mp3-preview/97dac628da05e44a4c7050bc8e5e2078af590e90?cid=66a3d2ff0264486bb7e5e495cc712271'
        const workTitle = 'Song'
        const correct = 'John'
        const decoys = ['Ron', 'Tom', 'Bob']
        return [audioUrl, workTitle, correct, decoys]
    }
}

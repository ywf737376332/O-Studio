const get = (url) => {
    return request('GET', url)
}

const post = (url, data) => {
    return request('POST', { url, data })
}

const put = (url, data) => {
    return request('PUT', { url, data })
}

const del = (url, data) => {
    return request('DEL', { url, data })
}

const request = (method, data) => {
    return new Promise((resolve, reject) => {
        window.ipcRenderer.invoke('fetch-data', { method, data }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export default {
    get,
    post,
    put,
    del
}
const HOSTNAME_WHITELIST = [
    self.location.hostname,
    'fonts.gstatic.com',
    'fonts.googleapis.com',
    'cdn.jsdelivr.net'
]

// The Util Function to hack URLs of intercepted requests
const getFixedUrl = (req) => {
    var now = Date.now()
    var url = new URL(req.url)


    url.protocol = self.location.protocol

    if (url.hostname === self.location.hostname) {
        url.search += (url.search ? '&' : '?') + 'cache-bust=' + now
    }
    return url.href
}


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim())
})


//   fetch latest data from the internet and if the data is not available then use the cached data

self.addEventListener('fetch', event => {
    const req = event.request
    const url = new URL(req.url)

    if (req.method !== 'GET' || !HOSTNAME_WHITELIST.includes(url.hostname)) {
        return
    }

    event.respondWith(
        fetch(getFixedUrl(req), {
            mode: 'cors'
        }).catch(() => caches.match(req))
    )
})
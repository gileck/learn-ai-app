import { useEffect, useState } from "react";
import { localStorageAPI } from "./localStorageAPI";

const { getData, saveData } = localStorageAPI()
const STALE_TIME = 1000 * 60 * 60; // 1 hour
const UPDATE_TIME = 1000 * 60 // 1 minute

const fetchCache = {}
const fetchPromiseCache = {}
const cache = getData('fetchCache') || {};
const getFromCache = (url) => cache[url];
const saveToCache = (url, data) => {
    const dataClone = JSON.parse(JSON.stringify(data));
    if (dataClone?.dataClone?.apiPrice) {
        dataClone.dataClone.apiPrice = null
    }
    cache[url] = dataClone;
    saveData('fetchCache', cache);
}

function getDataFromCache(url, overrideStaleTime) {
    const data = getFromCache(url);
    if (data) {
        const { timestamp, data: dataFromCache } = data;
        const now = new Date().getTime();
        const diff = now - timestamp;
        if (diff < overrideStaleTime || STALE_TIME) {
            return dataFromCache;
        }
    }
    return null;
}

function saveDataToCache(url, data) {
    saveToCache(url, { timestamp: new Date().getTime(), data });
}

function updateCache(url) {
}

function updateCacheInBackground(url) {
    if (fetchCache[url]) {
        return fetchCache[url]
    }
    fetchCache[url] = fetch(url)
        .then((res) => res.json())
        .then((data) => {
            saveDataToCache(url, data);
        }).catch((e) => {
            console.error('Error fetching data', e.message);
        }).finally(() => {
            delete fetchCache[url]
        })
    return fetchCache[url]
}

function shouldFetchInBackground(url) {
    const data = getFromCache(url);
    if (data) {
        const { timestamp } = data;
        const now = new Date().getTime();
        const diff = now - timestamp;
        return diff > UPDATE_TIME;
    }
    return true;
}

export function useFetch(_url, options = {}) {
    const query = options.query ? '?' + new URLSearchParams(options.query).toString() : '';
    const url = _url + query;
    const shouldUsecache = options.shouldUsecache !== false;
    const disableFetchInBackground = options.disableFetchInBackground === true;
    const overrideStaleTime = options.overrideStaleTime;


    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const dataFromCache = shouldUsecache ? getDataFromCache(url, overrideStaleTime) : null;

    useEffect(() => {
        if (dataFromCache) {
            setData(dataFromCache);
            setLoading(false);
            return
        }
        setLoading(true);
        fetchPromiseCache[url] = fetchPromiseCache[url] || fetch(url, options)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Error fetching data');
                } else {
                    return res.json()
                }
            })
            .then((data) => {
                setData(data);
                if (options.onDataFetched) {
                    options.onDataFetched(data);
                }
                saveDataToCache(url, data);

            }).catch((e) => {
                console.error('Error fetching data', e.message);
                setError(e);
            }).finally(() => {
                delete fetchPromiseCache[url]
                setLoading(false);
            })

    }, [url]);

    if (dataFromCache) {
        if (!disableFetchInBackground && shouldFetchInBackground(url)) {
            updateCacheInBackground(url)
        }
        // return { data: dataFromCache, loading: false, error: null }
    }

    return { data, loading, error };
}
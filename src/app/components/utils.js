import { localStorageAPI } from '../localStorageAPI';

export const colors = [
    "#f5f59a",  // Ivory
    "#fec8c8",  // Light Gray
    "#cbccfa",  // Alice Blue
    "#e6e6fa",  // Lavender
    "#b9ffdc",  // Mint Cream
    "#abeeee",  // Light Cyan
    "#fafad2",  // Pale Goldenrod
    "#ffe4e1",  // Misty Rose
    "#ffdab9",  // Peach Puff
    "#ffb6c1",  // Light Pink
    "#fffacd",  // Lemon Chiffon
    "#ffffe0",  // Light Yellow
    "#afeeee"   // Pale Turquoise
];
export function getColor({ mainColor, index }) {
    return colors.filter(c => c !== mainColor)[index % colors.length]
}
export function speak(text) {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(text);
    if (synth.speaking) {
        synth.cancel();
    } else {
        synth.speak(utterThis);
    }
}

export function setRouteInUrl(route) {
    if (typeof window === 'undefined') return;
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('route', route.join('_'));
    window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
    window.scrollTo(0, 0);
}

export function getRouteFromUrl() {
    if (typeof window === 'undefined') return [];
    const searchParams = new URLSearchParams(location.search);
    const route = searchParams.get('route');
    return route ? route.split('_') : [];
}

export function getPageFromUrl() {
    if (typeof window === 'undefined') return 'randomSubjects';
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('page');
}

export function addToHistory(item) {
    const history = localStorageAPI().getData('history') || [];
    localStorageAPI().saveData('history', [...history, item])
}


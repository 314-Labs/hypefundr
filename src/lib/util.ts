import BunnyClient from './bunny';

import {
	PUBLIC_BUNNY_API_KEY,
	PUBLIC_BUNNY_CDN_HOSTNAME,
	PUBLIC_BUNNY_STORAGE_ZONE
} from '$env/static/public';

const bunny = new BunnyClient(
	PUBLIC_BUNNY_API_KEY,
	PUBLIC_BUNNY_STORAGE_ZONE,
	PUBLIC_BUNNY_CDN_HOSTNAME
);

export const getGameCover = (id: string) => bunny.getUrl(`images/${id}/cover.jpg`);

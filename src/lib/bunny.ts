export default class BunnyClient {
	private readonly apiKey: string;
	private readonly storageZone: string;
	private readonly cdnHostname: string | undefined;
	constructor(apiKey: string, storageZone: string, cdnHostname: string | undefined) {
		this.apiKey = apiKey;
		this.storageZone = storageZone;
		this.cdnHostname = cdnHostname;
	}

	public getUrl(path: string) {
		return `http://${this.cdnHostname}/${path}`;
	}

	public async upload(path: string, fileBuff: Buffer, contentType: string | undefined) {
		const url = `https://storage.bunnycdn.com/${this.storageZone}/${path}`;
		const options = {
			method: 'PUT',
			headers: {
				'content-type': contentType ?? 'application/octet-stream',
				AccessKey: this.apiKey
			},
			body: fileBuff
		};
		const res = await fetch(url, options);
	}
}

import type { Tag } from '$lib/types/tag.interface';

export const danceEmoji = '💃';
export const angryEmoji = '😠';
export const sadEmoji = '😔';
export const happyEmoji = '😊';
export const thinkingEmoji = '🤔';
export const eyesRoll = '🙄';

export const redColor = '#dc3545';
export const greenColor = '#198754';
export const yellowColor = '#ffc107';
export const cyanColor = '#0dcaf0';

export const tagsFromServer: Array<Tag> = [
	{
		id: '2496d1bc-e62a-46cb-b0bb-96c080cf97df',
		name: 'python',
		description: 'import this. Beautiful is better than ugly...'
	},
	{
		id: '4607f970-7d6c-4116-a34c-006517196591',
		name: 'webdev',
		description: 'Developing the internet...'
	},
	{
		id: '76553ffa-1cb9-4ad3-ad7b-384041dca5aa',
		name: 'rust',
		description: 'Rust...Building confident, high-performance, and safe systems.'
	},
	{
		id: 'f9936911-7a4d-4ef7-9c7a-3b2399599d60',
		name: 'javascript',
		description:
			"Once relegated to the browser as one of the 3 core technologies of the web, JavaScript can now be found almost anywhere you find code. JavaScript developers move fast and push software development forward; they can be as opinionated as the frameworks they use, so let's keep it clean here and make it a place to learn from each other! "
	}
];

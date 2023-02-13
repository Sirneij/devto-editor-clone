import { writable, type Writable } from 'svelte/store';

export const tagList: Writable<Array<string>> = writable([]);

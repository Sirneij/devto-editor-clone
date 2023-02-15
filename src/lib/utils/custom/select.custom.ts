import { tagList } from '$lib/stores/tag.store';
import type { Tag } from '../../types/tag.interface';

/**
 * @file $lib/utils/select.custom.ts
 * @param { string } tagName - The tag to be created
 * @returns {HTMLDivElement} The `div` element created
 */
const createTag = (tagName: string): HTMLDivElement => {
	const div = document.createElement('div');
	div.classList.add('tag', tagName.trim().toLowerCase());
	const span = document.createElement('span');
	span.innerHTML = tagName.trim().toLowerCase();
	const removeTag = document.createElement('i');
	removeTag.classList.add('fa-solid', 'fa-close');
	div.appendChild(span);
	div.appendChild(removeTag);

	return div;
};

/**
 * Removes duplicate tags from the tags container
 * @file $lib/utils/select.custom.ts
 * @param { HTMLDivElement } tagContainer - The div container that houses the tag.
 */
const reset = (tagContainer: HTMLDivElement): void => {
	tagContainer.querySelectorAll('.tag').forEach((tag) => {
		tag.parentElement?.removeChild(tag);
	});
};

/**
 * Update certain properties (value, placeholder, disabled, and focus) of the input element
 * @file $lib/utils/select.custom.ts
 * @param {HTMLInputElement} input - The input element
 * @param {number} numOfTagsRemaining - The remaining tags to accommodate
 */
const updateInput = (input: HTMLInputElement, numOfTagsRemaining: number): void => {
	if (numOfTagsRemaining === 0) {
		input.value = '';
		input.placeholder = `You can't add more tag...`;
		input.disabled = true;
	} else if (numOfTagsRemaining === 4) {
		input.placeholder = `Add up to ${numOfTagsRemaining} tags (atleast 1 is required)...`;
		input.focus();
	} else {
		input.value = '';
		input.placeholder = `You can add ${numOfTagsRemaining} more...`;
		input.disabled = false;
		input.focus();
	}
};
/**
 * Add tag to the list of tags
 * @file $lib/utils/select.custom.ts
 * @param {Array<string>} tags - Array of strings
 * @param {HTMLDivElement} tagContainer - The `div` element with `.tag-container` class to add tags to.
 */
const addTag = (tags: Array<string>, tagContainer: HTMLDivElement): void => {
	reset(tagContainer);
	tags
		.slice()
		.reverse()
		.forEach((tag) => {
			const input = createTag(tag);
			tagContainer.prepend(input);
		});
};

/**
 * Show tag suggestions and set input element's value
 * @file $lib/utils/select.custom.ts
 * @param {Array<Tag>} suggestions - Array of tags
 * @param {HTMLDivElement} suggestionsPannel - The `div` element with `.suggestions` class.
 * @param {inputElement} inputElement - The `input` element whose value will be altered.
 * @param {Array<string>} tags - The list of tags added to the UI
 * @param {HTMLDivElement} tagContainer - The container housing all tags.
 * @param {number} numOfTagsRemaining - The number of tags remaining.
 * @param {Array<string>} serverTagsArrayOfNames - The list of tags from the server.
 */
const showSuggestionPannel = (
	suggestions: Array<Tag>,
	suggestionsPannel: HTMLDivElement,
	inputElement: HTMLInputElement,
	tags: Array<string>,
	tagContainer: HTMLDivElement,
	numOfTagsRemaining: number,
	serverTagsArrayOfNames: Array<string>
): void => {
	if (suggestions.length > 0) {
		suggestionsPannel.innerHTML = '';
		const h5Element = document.createElement('h5');
		h5Element.innerHTML = `Available Tags`;
		h5Element.classList.add('headline', 'headline-3');
		suggestionsPannel.appendChild(h5Element);
		suggestions.forEach((suggested) => {
			const divElement = document.createElement('div');
			divElement.classList.add('suggestion-item');
			const spanElement = document.createElement('span');
			spanElement.classList.add('tag', suggested.name.toLowerCase());
			spanElement.innerHTML = suggested.name.toLowerCase();
			divElement.appendChild(spanElement);
			const smallElement = document.createElement('small');
			smallElement.innerHTML = suggested.description;
			divElement.appendChild(smallElement);
			suggestionsPannel.appendChild(divElement);
			divElement.addEventListener('click', () => {
				inputElement.value = suggested.name;
				// Add tag to the list of tags
				tags.push(suggested.name);
				performAddingRags(
					tags,
					tagContainer,
					numOfTagsRemaining,
					serverTagsArrayOfNames,
					inputElement
				);
				suggestionsPannel.innerHTML = '';
			});
		});
	}
};

/**
 * Manipulates the `DOM` with user tags and provides tags suggestions as user types.
 * @file $lib/utils/select.custom.ts
 * @param {Array<Tag>} serverTags - Tags from the server.
 * @param {HTMLDivElement} suggestionsPannel - The `div` element that shows suggestions.
 * @param {HTMLInputElement} input - The `input` element in which tags are entered.
 * @param {HTMLDivElement} tagContainer - The `div` housing selected tags.
 */
export const customSelect = (
	serverTags: Array<Tag>,
	suggestionsPannel: HTMLDivElement,
	input: HTMLInputElement,
	tagContainer: HTMLDivElement,
	tags: Array<string> = []
): void => {
	// Converts the Array<Tags> into Array<tag.name> for easy processing later on.
	let serverTagsArrayOfNames: Array<string> = serverTags.map((tag) => tag.name);

	// A reference tracking the number of tags left
	let numOfTagsRemaining = 0;

	// In case tags array isn't empty, particularly during preview of the post 
	// Pand update of articles, the tags are prepopulated in the UI.
	if (tags.length >= 1) {
		performAddingRags(tags, tagContainer, numOfTagsRemaining, serverTagsArrayOfNames, input);
	}

	// As user starts typing, do:
	input.addEventListener('keyup', (event) => {
		// Get a reference to the input element
		const inputElement = event.target as HTMLInputElement;

		// Filter the Array<Tags> and bring those tags whose `names`
		// match part or all the value of the input element
		const suggestions = serverTags.filter((tag) => {
			if (!tags.includes(tag.name)) {
				return tag.name.toLowerCase().match(input.value.toLowerCase());
			}
		});

		// Display suggestions based on the filter above
		// The input value might have been changed by this function too
		showSuggestionPannel(
			suggestions,
			suggestionsPannel,
			inputElement,
			tags,
			tagContainer,
			numOfTagsRemaining,
			serverTagsArrayOfNames
		);

		// Get the value of the input element and remove trailing or leading comma (,) 
		// since comma (,) adds a tag to the tag array and container
		const inputValue = inputElement.value
			.trim()
			.toLowerCase()
			.replace(/(^,)|(,$)/g, '');

		// When user presses the `Enter` key or comman (,)
		if ((event as KeyboardEvent).key === 'Enter' || (event as KeyboardEvent).key === ',') {
			//  Check to ensure that the selected tag is available and has not been chosen before.
			if (serverTagsArrayOfNames.includes(inputValue) && !tags.includes(inputValue)) {
				// Add tag to the list of tags
				tags.push(inputValue);
				performAddingRags(
					tags,
					tagContainer,
					numOfTagsRemaining,
					serverTagsArrayOfNames,
					inputElement
				);
			} else {
				// If the chosen tag isn't available, alert the user
				suggestionsPannel.innerHTML = '';
				const span = document.createElement('span');
				span.classList.add('error');
				span.style.fontSize = '13px';
				span.innerHTML = `Sorry, you cannot add this tag either it's not available or been previously added.`;
				suggestionsPannel.appendChild(span);
			}
		}

		// Ensure that suggestion doesn't show up when input is empty
		if (input.value === '') {
			suggestionsPannel.innerHTML = '';
		}
	});

	// Listen to all clicks on the page's element and remove the selected tag.
	document.addEventListener('click', (event) => {
		const d = event.target as HTMLElement;
		// If the clicked element is an `i` tag with `fa-close` class, remove the tag from 
		// the UI and tags array and restore it to the array of tags from the server.
		// `<i class="fa-solid fa-close"></i>` is the fontawesome icon to remove a tag from 
		// the tag container and tags array.
		if (d.tagName === 'I' && d.classList.contains('fa-close')) {
			const tagName = d.previousElementSibling?.textContent?.trim().toLowerCase() as string;
			const index = tags.indexOf(tagName);
			tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
			serverTagsArrayOfNames = [tagName, ...serverTagsArrayOfNames];
			addTag(tags, tagContainer);
			numOfTagsRemaining = 4 - tags.length;
			updateInput(input, numOfTagsRemaining);
		}
	});
};

/**
 * Add tag to the list of tags and perform other operations
 * @file $lib/utils/select.custom.ts
 * @param {Array<string>} tags - Array of strings
 * @param {HTMLDivElement} tagContainer - The `div` element with `.tag-container` class to add tags to.
 * @param {number} numOfTagsRemaining - The number of tags remaining
 * @param {Array<string>} serverTagsArrayOfNames - Array of tags from the DB
 * @param {HTMLInputElement} inputElement - The `input` element
 */
const performAddingRags = (
	tags: Array<string>,
	tagContainer: HTMLDivElement,
	numOfTagsRemaining: number,
	serverTagsArrayOfNames: Array<string>,
	inputElement: HTMLInputElement
): void => {
	// Include the tag in the list of tags in the UI
	addTag(tags, tagContainer);
	// Update the number of allowed tags
	numOfTagsRemaining = 4 - tags.length;
	// Remove the tag from serverTagsArrayOfNames
	serverTagsArrayOfNames = [
		...serverTagsArrayOfNames.slice(0, serverTagsArrayOfNames.indexOf(tags[tags.length - 1])),
		...serverTagsArrayOfNames.slice(serverTagsArrayOfNames.indexOf(tags[tags.length - 1]) + 1)
	];
	// Update the properties of the input element
	updateInput(inputElement, numOfTagsRemaining);

	tagList.set(tags);
};

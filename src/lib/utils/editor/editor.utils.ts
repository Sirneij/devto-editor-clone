import DOMPurify from 'dompurify';
import { marked } from 'marked';
import hljs from 'highlight.js';

export const setCaretPosition = (
	ctrl: HTMLTextAreaElement | EventTarget,
	start: number,
	end: number
) => {
	const targetElement = ctrl as HTMLTextAreaElement;
	// Modern browsers
	if (targetElement.setSelectionRange) {
		targetElement.setSelectionRange(start, end);

		// IE8 and below
	} else {
		const range = document.createRange();
		range.collapse(true);
		range.setStart(targetElement, targetElement.selectionStart);
		range.setEnd(targetElement, targetElement.selectionEnd);
		range.selectNode(targetElement);
	}
};

export const getCaretPosition = (ctrl: HTMLTextAreaElement) =>
	ctrl.selectionStart
		? {
				start: ctrl.selectionStart,
				end: ctrl.selectionEnd
		  }
		: {
				start: 0,
				end: 0
		  };

/**
 * @file $lib/utils/editor/editor.utils.ts
 * @param { string } text - The markdown text to be parsed
 * @returns {string} The parsed markdown
 */
export const parseMarkdown = (text: string): string => {
	marked.setOptions({
		renderer: new marked.Renderer(),
		highlight: function (code, lang) {
			const language = hljs.getLanguage(lang) ? lang : 'plaintext';
			return hljs.highlight(code, { language }).value;
		},
		langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
		pedantic: false,
		gfm: true,
		breaks: false,
		sanitize: false,
		smartypants: false,
		xhtml: false
	});

	return DOMPurify.sanitize(marked.parse(text));
};

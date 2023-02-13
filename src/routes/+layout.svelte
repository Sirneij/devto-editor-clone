<script lang="ts">
	import Footer from '$lib/components/Footer/Footer.svelte';
	import '$lib/dist/css/all.min.css';
	import '$lib/dist/css/style.min.css';
	import { notification } from '$lib/stores/notification.store';
	import { afterUpdate } from 'svelte';
	import { fly } from 'svelte/transition';

	afterUpdate(async () => {
		const notifyEl = document.getElementById('notification');
		if (notifyEl && $notification.message !== '') {
			setTimeout(() => {
				notifyEl.classList.add('disappear');
				$notification = { message: '', backgroundColor: '' };
			}, 5000);
		}
	});
</script>

{#if $notification.message && $notification.backgroundColor}
	<p
		class="notification"
		id="notification"
		style="background: {$notification.backgroundColor}"
		in:fly={{ x: 200, duration: 500, delay: 500 }}
		out:fly={{ x: 200, duration: 500 }}
	>
		{$notification.message}
	</p>
{/if}

<main>
	<article>
		<slot />
	</article>
</main>

<Footer />

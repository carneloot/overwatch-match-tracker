<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';

	import { onMount } from 'svelte';

	let wrapperWidth: number;
	let wrapper: HTMLElement;

	onMount(async () => {
		if (!window.google) return;

		const dataLoginURI = new URL($page.url);
		dataLoginURI.pathname = '/auth/google';

		window.google.accounts.id.initialize({
			client_id: PUBLIC_GOOGLE_CLIENT_ID,
			context: 'use',
			ux_mode: 'redirect',
			login_uri: dataLoginURI.toString()
		});

		window.google.accounts.id.renderButton(wrapper, {
			type: 'standard',
			shape: 'pill',
			theme: 'filled_blue',
			text: 'continue_with',
			size: 'large',
			logo_alignment: 'left',
			width: wrapperWidth
		});
	});
</script>

<svelte:head>
	<script src="https://accounts.google.com/gsi/client" async defer></script>
</svelte:head>

<div class="flex w-full justify-center" bind:clientWidth={wrapperWidth} bind:this={wrapper} />

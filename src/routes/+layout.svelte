<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';

	import '@skeletonlabs/skeleton/styles/skeleton.css';

	import '../app.css';

	import Header from '$lib/components/header.svelte';

	export let data;
</script>

<div class="mx-auto grid h-full grid-rows-[auto_1fr]">
	<Header user={data.user} />

	<main class="container mx-auto px-4 py-6">
		<slot />
	</main>
</div>

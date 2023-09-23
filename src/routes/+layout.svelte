<script lang="ts">
	import '../app.css';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

	import { Modal, storePopup } from '@skeletonlabs/skeleton';

	import { initializeStores } from '@skeletonlabs/skeleton';

	initializeStores();

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<Modal />

<div class="mx-auto grid h-full grid-rows-[auto_1fr_auto]">
	<Header />

	<main class="container mx-auto px-4 py-6">
		<slot />
	</main>

	<Footer />
</div>

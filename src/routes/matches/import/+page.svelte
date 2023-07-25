<script lang="ts">
	import { Accordion, AccordionItem, FileDropzone } from '@skeletonlabs/skeleton';
	import { FileSpreadsheet } from 'lucide-svelte';
	import Img from '@zerodevx/svelte-img';

	import { PUBLIC_REDDIT_SPREADSHEET } from '$env/static/public';
	import sheetTutorialImage from '$lib/assets/images/sheet-tutorial.png?run';
	import { cn } from '$lib/utils';
	import { filesize } from 'filesize';

	let inputFiles: FileList;
	let rankUpdateFiles: FileList;

	const fileSizeOptions = {
		standard: 'jedec'
	};

	const onSubmitForm = async () => {
		const [inputFile] = inputFiles ?? [];
		const [rankUpdateFile] = rankUpdateFiles ?? [];

		const { default: ProcessImportFilesWorker } = await import(
			'$lib/workers/process-import-files.worker?worker'
		);

		const worker = new ProcessImportFilesWorker();

		worker.postMessage({ inputFile, rankUpdateFile });
		worker.onmessage = (message) => {
			console.log(message.data.matches);
		};
	};
</script>

<svelte:head>
	<title>Import data</title>
</svelte:head>

<h2 class="h2 mb-6">Import data</h2>

<p class="mb-2">
	If you already use <a class="link" href={PUBLIC_REDDIT_SPREADSHEET} target="_blank"
		>u/HarryProtter Overwatch Match Tracker Spreadsheet</a
	>, you can import your data using this page!
	<br />
</p>

<p class="mb-2">
	First you need to export both the "INPUT" and "Rank Update" sheets to a CSV file and upload both
	of them here.
</p>

<Accordion class="card mb-3">
	<AccordionItem>
		<svelte:fragment slot="summary">Click here to show image instructions</svelte:fragment>
		<svelte:fragment slot="content">
			<Img src={sheetTutorialImage} class="mb-2 rounded" />
		</svelte:fragment>
	</AccordionItem>
</Accordion>

<form class="contents" on:submit|preventDefault={onSubmitForm}>
	<div class="mb-2 grid gap-2 sm:grid-cols-2">
		<FileDropzone
			class={cn({ 'variant-ghost-success': inputFiles?.length })}
			name="input"
			accept=".csv"
			bind:files={inputFiles}
			required
		>
			<svelte:fragment slot="lead">
				<div class="flex justify-center"><FileSpreadsheet size={36} /></div>
			</svelte:fragment>
			<svelte:fragment slot="message">
				{#if inputFiles?.length}
					{@const file = inputFiles[0]}
					Uploaded <strong>{file.name}</strong> ({filesize(file.size, fileSizeOptions)})
				{:else}
					Upload the <strong>input.csv</strong> file
				{/if}
			</svelte:fragment>
		</FileDropzone>

		<FileDropzone
			class={cn({ 'variant-ghost-success': rankUpdateFiles?.length })}
			name="rankUpdate"
			accept=".csv"
			bind:files={rankUpdateFiles}
		>
			<svelte:fragment slot="lead">
				<div class="flex justify-center"><FileSpreadsheet size={36} /></div>
			</svelte:fragment>
			<svelte:fragment slot="message">
				{#if rankUpdateFiles?.length}
					{@const file = rankUpdateFiles[0]}
					Uploaded <strong>{file.name}</strong> ({filesize(file.size, fileSizeOptions)})
				{:else}
					Upload the <strong>rank-updates.csv</strong> file
				{/if}
			</svelte:fragment>
		</FileDropzone>
	</div>
	<div class="flex justify-center">
		<button class="btn variant-filled-success" type="submit">Import</button>
	</div>
</form>

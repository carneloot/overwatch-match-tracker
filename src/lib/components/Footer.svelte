<script lang="ts">
	import Github from '$lib/components/Github.svelte';
</script>

<footer class="flex w-full items-center justify-end bg-surface-200 px-10 py-7">
	<div class="flex flex-col">
		<div class="flex flex-row items-center gap-2">
			<p>
				Made with ❤️ by
				<a href="https://carneloot.com" target="_blank" class="link">carneloot</a>
				&copy; {new Date().getFullYear()}
			</p>
			<a
				href="https://github.com/carneloot/overwatch-match-tracker"
				target="_blank"
				class="rounded-full p-1 text-white"
			>
				<Github size={20} />
			</a>
		</div>
		<div class="flex flex-row" />
	</div>
</footer>

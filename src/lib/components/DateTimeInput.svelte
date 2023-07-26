<script lang="ts">
	import type { ClassValue } from 'clsx';
	import { format } from 'date-fns';

	import { DATETIME_LOCAL_FORMAT, cn } from '$lib/utils';

	export let className: ClassValue | null = null;

	export let name: string;
	export let value: Date;
</script>

<input
	type="datetime-local"
	{...$$props}
	class={cn('input !mt-2 !rounded-container-token', className)}
	name={`_${name}`}
	value={format(value, DATETIME_LOCAL_FORMAT)}
	on:change={(e) => {
		if (e.currentTarget.value) {
			value = new Date(e.currentTarget.value);
		}
	}}
/>
<input type="hidden" {name} value={value.toISOString()} />

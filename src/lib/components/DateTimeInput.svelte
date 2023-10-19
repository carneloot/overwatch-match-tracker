<script lang="ts">
	import { format, isAfter, isBefore } from 'date-fns';
	import type { ClassValue } from 'clsx';

	import { DATETIME_LOCAL_FORMAT, cn } from '$lib/utils';

	export let className: ClassValue | null = null;

	export let name: string;
	export let value: Date;

	export let minDate: Date | undefined = undefined;
	export let maxDate: Date | undefined = undefined;

	$: if (maxDate && isAfter(value, maxDate)) {
		value = maxDate;
	}

	$: if (minDate && isBefore(value, minDate)) {
		value = minDate;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { minDate: _, maxDate: _2, ...rest } = $$props;
</script>

<input
	type="datetime-local"
	{...rest}
	class={cn('input !mt-2 !rounded-container-token', className)}
	name={`_${name}`}
	value={format(value, DATETIME_LOCAL_FORMAT)}
	min={minDate ? format(minDate, DATETIME_LOCAL_FORMAT) : undefined}
	max={maxDate ? format(maxDate, DATETIME_LOCAL_FORMAT) : undefined}
	on:change={(e) => {
		if (e.currentTarget.value) {
			value = new Date(e.currentTarget.value);
		}
	}}
/>
<input type="hidden" {name} value={value.toISOString()} />

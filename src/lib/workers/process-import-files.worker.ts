import csvtojson from 'csvtojson';
import mapKeys from 'lodash/mapKeys';
import camelCase from 'lodash/camelCase';

import { z } from 'zod';
import { ZodType } from 'zod/lib/types';

type WorkerData = {
	inputFile: File;
	rankUpdateFile: File;
};

interface ParseInputFile {
	file: File;
	rankUpdates: Map<string, string>;
}

interface ParseRankUpdates {
	file: File;
}

const InputRowSchema = z.object({
	role: z.string(),
	matchResult: z.enum(['Win', 'Loss', 'Draw']),
	hero: z.string(),
	map: z.string(),
	groupSize: z.string(),
	specificPlayers: z.string().transform((v) => v.split(/,\s*/)),
	rankUpdate: z.string().optional(),
	dateTime: z.coerce.date()
});
type InputRow = z.infer<typeof InputRowSchema>;

const csvToJSON = <T extends z.ZodType>(schema: T) => {
	return new TransformStream<string, z.infer<T>>({
		async transform(chunk, controller) {
			await csvtojson({ ignoreEmpty: true, trim: true })
				.fromString(chunk)
				.subscribe(
					(data) => {
						data = mapKeys(data, (_, key) =>
							camelCase(key.toLowerCase().replace(/[^a-z ]/g, ''))
						);

						const result = schema.safeParse(data);
						if (result.success) {
							controller.enqueue(result.data);
						}
					},
					(err) => controller.error(err),
					() => controller.terminate()
				);
		}
	});
};

const parseInputFile = async ({ file }: ParseInputFile) =>
	new Promise((resolve) => {
		const data: InputRow[] = [];
		file.stream()
			.pipeThrough(new TextDecoderStream())
			.pipeThrough(csvToJSON(InputRowSchema))
			.pipeTo(
				new WritableStream({
					write(chunk) {
						data.push(chunk);
					},
					close() {
						resolve(data);
					}
				})
			);
	});

const parseRankUpdates = async ({ file }: ParseRankUpdates) => {
	const map = new Map<string, string>();
	return map;
};

onmessage = async (event: MessageEvent<WorkerData>) => {
	const { rankUpdateFile, inputFile } = event.data;

	const rankUpdates = await parseRankUpdates({ file: rankUpdateFile });

	const matches = await parseInputFile({ file: inputFile, rankUpdates });

	postMessage({
		matches
	});
};

export {};

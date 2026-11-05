import { Buffer } from "node:buffer";
import { brotliCompressSync } from "node:zlib";
import { minify } from "@minify-html/node";

for (const file of new Bun.Glob("**/*.html").scanSync({ cwd: "./src" })) {
	/** Bun compilation result of source HTML. */
	const result = await Bun.build({
		entrypoints: [`./src/${file}`],
		root: "./src",
		outdir: "./build",
		compile: true,
		target: "browser",
		minify: true,
		jsx: {
			runtime: "automatic",
			importSource: "@functions/jsx-runtime",
		}
	});

	// Error out if bundle fails:
	if (!result.success) {
		console.error("Bundle failure:", result.logs);
		process.exit(1);
	}

	/** Build index.html contents. */
	const buildHTML = await Bun.file(`./build/${file}`).text();

	/** Minified index.html buffer. */
	const output = minify(Buffer.from(buildHTML), {
		allow_noncompliant_unquoted_attribute_values: false,
		allow_optimal_entities: true,
		allow_removing_spaces_between_attributes: false,
		keep_closing_tags: true,
		keep_comments: false,
		keep_html_and_head_opening_tags: true,
		keep_input_type_text_attr: false,
		keep_ssi_comments: false,
		minify_css: false,
		minify_doctype: false,
		minify_js: true,
		preserve_brace_template_syntax: true,
		preserve_chevron_percent_template_syntax: true,
		remove_bangs: false,
		remove_processing_instructions: false
	});

	// Overwrite build file with output contents:
	await Bun.write(`./build/${file}`, output);

	/** Data compressed over gzip. */
	const gzip = Bun.gzipSync(Buffer.from(output));

	/** Data compressed over brotli. */
	const brotli = brotliCompressSync(output);

	// Log file sizes to console:
	console.log(file);
	console.log("Output/Gzip/Brotli bytes:", output.byteLength, gzip.byteLength, brotli.byteLength);
}
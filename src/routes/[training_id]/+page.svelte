<script>
	export let data;
	const { formattedTraining } = data;

	function handleCopy() {
		navigator.clipboard.writeText(formattedTraining);
	}
</script>

<pre><code>{formattedTraining}</code></pre>
<button on:click={handleCopy}>Copier</button>

<script>
	export let data;
	const { formattedTraining } = data;

	function handleCopy() {
		navigator.clipboard.writeText(formattedTraining);
	}
</script>

<div class="container">
	<pre><code>{formattedTraining}</code></pre>
	<button on:click={handleCopy}>Copier</button>
</div>

<style>
	.container {
		position: relative;
	}

	pre {
		background-color: rgb(234, 234, 234);
		padding: 16px;
		border-radius: 8px;
		box-shadow: 3px 3px 4px -1px rgba(0, 0, 0, 0.68);
	}

	button {
		position: absolute;
		top: 4px;
		right: 4px;
	}
</style>

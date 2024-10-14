<script>
	export let data;
	$: formattedTrainingPromise = data.formattedTrainingPromise;
</script>

<div class="container">
	{#await formattedTrainingPromise}
		Formattage en cours...
	{:then training}
		<pre><code>{training}</code></pre>
		<button
			on:click={function handleCopy() {
				navigator.clipboard.writeText(training);
			}}>Copier</button
		>
	{:catch}
		Une erreur est survenue
	{/await}
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
		overflow: hidden;
		white-space: pre-wrap;
	}

	button {
		position: absolute;
		top: 4px;
		right: 4px;
	}
</style>

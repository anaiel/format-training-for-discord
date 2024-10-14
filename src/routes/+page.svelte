<script>
	import { formatResultsForSelect } from '$lib/trainings';

	export let data;

	const trainings = data.results ? formatResultsForSelect(data.results) : undefined;
	let selectedValue = trainings ? trainings[0].id : '';
	let formattedTraining = data.formattedTraining;
</script>

<h1>Formatter l'entrainement pour Discord</h1>
<p>
	Cet outil permet de formatter facilement un entrainement préparé sur Notion pour le coller sur
	Discord.
</p>

{#if trainings}
	<label for="select">Choisir l'entrainement :</label>
	<select id="select" bind:value={selectedValue}>
		{#each trainings as { name, id }}
			<option value={id}>{name}</option>
		{/each}
	</select>

	{#if formattedTraining}
		<div>{formattedTraining}</div>
		<button on:click={() => navigator.clipboard.writeText(formattedTraining)}>Copier</button>
	{/if}
{:else}
	<p>Une erreur est survenue</p>
{/if}

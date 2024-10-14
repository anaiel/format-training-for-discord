<script>
	import { formatResultsForSelect } from '$lib/trainings';

	export let data;

	const trainings = data.results ? formatResultsForSelect(data.results) : undefined;
	let selectedValue = trainings ? trainings[0].id : '';
</script>

<h1>Formatter l'entrainement pour Discord</h1>
<p>
	Cet outil permet de formatter facilement un entrainement préparé sur Notion pour le coller sur
	Discord.
</p>

{#if trainings}
	<form>
		<label for="select">Choisir l'entrainement :</label>
		<select id="select" bind:value={selectedValue}>
			{#each trainings as { name, id }}
				<option value={id}>{name}</option>
			{/each}
		</select>
		<button>Formatter</button>
	</form>
{:else}
	<p>Une erreur est survenue</p>
{/if}

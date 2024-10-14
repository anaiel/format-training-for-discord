<script>
	import { goto } from '$app/navigation';
	import { formatResultsForSelect } from '$lib/trainings';

	export let data;
	const { trainingsData } = data;

	const trainings = trainingsData.results
		? formatResultsForSelect(trainingsData.results)
		: undefined;
	let selectedValue = trainings ? trainings[0].id : '';
</script>

<header>Autocoaching A</header>
<main>
	<h1>Formatter l'entrainement pour Discord</h1>
	<p>
		Cet outil permet de formatter facilement un entrainement préparé sur Notion pour le coller sur
		Discord.
	</p>

	{#if trainings}
		<label for="select">Choisir l'entrainement :</label>
		<select
			id="select"
			bind:value={selectedValue}
			on:change={(e) => {
				const trainingId = e.currentTarget.value;
				if (trainingId) {
					goto(`${trainingId}`);
				}
			}}
		>
			{#each trainings as { name, id }}
				<option value={id}>{name}</option>
			{/each}
		</select>

		<slot></slot>
	{:else}
		<p>Une erreur est survenue</p>
	{/if}
</main>

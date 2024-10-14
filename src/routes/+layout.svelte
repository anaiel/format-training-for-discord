<script>
	import { goto } from '$app/navigation';

	export let data;
	const { formattedTrainings } = data;
</script>

<header>Boucherie - Autocoaching A</header>
<main>
	<h1>Formatter l'entrainement pour Discord</h1>
	<p class="description">
		Cet outil permet de formatter facilement un entrainement préparé sur Notion pour le coller sur
		Discord.
	</p>

	{#if formattedTrainings}
		<label for="select">Choisir l'entrainement :</label>
		<select
			id="select"
			on:change={(e) => {
				const trainingId = e.currentTarget.value;
				if (trainingId) {
					goto(`${trainingId}`);
				}
			}}
		>
			{#each formattedTrainings as { name, id }}
				<option value={id}>{name}</option>
			{/each}
		</select>

		<slot></slot>
	{:else}
		<p>Une erreur est survenue</p>
	{/if}
</main>

<style>
	header {
		background-color: #0bae8c;
		padding: 16px 8px;
		color: white;
		font-size: 1.5rem;
		margin-bottom: 32px;
	}

	main {
		margin-inline: auto;
		max-width: 1000px;
		padding-inline: 16px;
	}

	h1 {
		font-size: 1.25rem;
		border-bottom: 2px solid #0bae8c;
		margin-bottom: 16px;
	}

	.description {
		margin-bottom: 32px;
	}
</style>

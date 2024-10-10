<script>
    export let data;

    let selectedValue = data.status === 200 && data.trainings ? data.trainings[0].id : "";
</script>

<h1>Formatter l'entrainement pour Discord</h1>
<p>Cet outil permet de formatter facilement un entrainement préparé sur Notion pour le coller sur Discord.</p>

{#if data.status === 200 && data.trainings}
<form>
    <label for="select">Choisir l'entrainement :</label>
    <select id="select" bind:value={selectedValue}>
        {#each data.trainings as {name, id}}
                <option value={id}>{name}</option>
        {/each}
    </select>
    <button>Formatter</button>
</form> 
{:else}
<p>Une erreur est survenue</p>
{/if}

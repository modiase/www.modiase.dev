<script lang="ts">
    import { Card } from "sveltestrap";
    export let title: string;
    export let messages : string[];

</script>

<Card class="d-flex flex-column align-items-center justify-content-center">
    <h1>{title}</h1>
    {#each messages as message}
        <p>{message}</p>
    {/each}
</Card>

<style>
    h1, p{
        text-align: center;
    }
    
</style>
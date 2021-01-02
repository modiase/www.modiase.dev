<script lang="ts">
    export let title: string;
    export let messages : string[];

</script>

<div class="d-flex flex-column align-items-center justify-content-center">
    <h1 class="h1">{title}</h1>
    {#each messages as message}
        <p class="h4">{message}</p>
    {/each}
</div>

<style>
    h1, p{
        text-align: center;
    }

    div{
        box-shadow: 0 0 2px white;
        padding: 30px;
    }
</style>
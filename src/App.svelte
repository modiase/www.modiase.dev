<script lang="ts">
	import SimpleCard from "./components/common/Card/Simple.svelte";

	const placeholderCardTitle = "Under Construction."
	const placeholderCardMessages = ["Hello! My site is currently undergoing a redesign.", "Please, come back at a later date."]
</script>

<main>
	<div>
		<p class="text-center text-jumbo">🚧</p>
		<SimpleCard title={placeholderCardTitle} messages={placeholderCardMessages}/>
	</div>
</main>

<style lang="scss">
	.text-jumbo{
		font-size: 12rem;
	}
	main {
		display: flex;
		position: relative;
		width: 100vw;
		height: 100vh;
		justify-content: center;
        text-shadow: 0 0 4px var(--secondary);
		div {
			margin-top: 20px;
		}
	}

</style>
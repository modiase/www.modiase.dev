<script lang="ts">
	import SimpleCard from "./components/common/Card/Simple.svelte";

	const placeholderCardTitle = "Under Construction."
	const placeholderCardMessages = ["Hello! My site is currently undergoing a redesign.", "Please, come back at a later date."]
</script>

<main>
	<SimpleCard title={placeholderCardTitle} messages={placeholderCardMessages}/>
</main>

<style lang="scss">
	main {
		display: flex;
		position: relative;
		width: 100vw;
		height: 100vh;
		justify-content: center;
		align-items: center;
	}

</style>
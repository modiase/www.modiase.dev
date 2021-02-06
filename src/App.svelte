<script lang="ts">
	import { MessageCard } from "./components/common/Card";

	const placeholderCardTitle = "Under Construction."
	const placeholderCardMessages = ["Hello! My site is currently undergoing a redesign.", "Please, come back at a later date."]
</script>

<main>
	<div>
		<p class="text-center text-jumbo">🚧</p>
		<MessageCard title={placeholderCardTitle} messages={placeholderCardMessages}/>
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

<script>
	import { Styles, Button, Row, Col } from 'sveltestrap';
	import  ListOption  from './listOption.svelte';
	import ViewList from "./viewList.svelte";
	import  { convertTimestampToDate }  from "./taskOption.svelte"
	import { onMount } from 'svelte'
	import { getAllListsForDeadlineChecking, getAllTasksWithoutComplete } from './firebase.js'


	let ListOptionComponent;
	let ViewListComponent;
	let results = [];



	// Keep checking the deadline of all tasks every minute
	onMount(async() => {
		
		setInterval(async() => {
			await getAllListsForDeadlineChecking().then(async returnList => { results = await getAllTasksWithoutComplete(returnList)})
		for (let i = 0;i<results.length;i++){
			if (results[i].length===1){
				continue;
			}
			for (let j=1;j<results[i].length;j++){
			if (new Date()>convertTimestampToDate(results[i][j][1])){
				alert("The deadline of task \""+results[i][j][0]+"\" under the list \""+results[i][0]+"\" has passed.")
				console.log("The deadline of task \""+results[i][j][0]+"\" under the list \""+results[i][0]+"\" has passed.")
			}
			}
			
		}
		// time interval
		}, 60000);


	});



	

</script>
<Styles/>
<main>
	<h1>Task Board</h1>
	<Row>
	<Col><Button color="dark" on:click={ListOptionComponent.toggle()}>Create new list</Button></Col>
	<Col><Button style="float:right;" color="dark" on:click={ViewListComponent.toggle()}>View list</Button></Col>
	</Row>
	<ListOption bind:this={ListOptionComponent}/>
	<ViewList bind:this={ViewListComponent}/>
</main>

<style>

	
	main {
		text-align: center;
		padding: 1em;
		max-width: 350px;
		margin: 0 auto;
	}

	h1 {
		color: #f19c2c;
		font-size: 4em;
		font-weight: 400;
	
	}


</style>
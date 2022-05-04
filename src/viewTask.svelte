<script>
    import { Styles, Modal, ModalFooter, Button, Table, Input, Icon } from "sveltestrap";
    import  TaskOption  from "./taskOption.svelte"
    import  ViewMoveTaskToList from "./viewMoveTaskToList.svelte"
    import { deleteTasks, getAllTasks } from "./firebase.js"
    

    let showTasks = false;
    let resultTasks = [];
    let TaskOptionComponent;
    let ViewMoveTaskToListComponent;
    let selectedListName;
    $: selectedTasks = []
    function addSelectedTasksToList(item){
        if (selectedTasks.includes(item)){
            selectedTasks.splice(item,1)
            selectedTasks = selectedTasks


        }else{
            selectedTasks.push(item)
            selectedTasks = selectedTasks
        

        }
        
        
    }


    function actionBeforeDeleteTasks(selectedListName,selectedTasksForDeletion){
        if (deleteTasks(selectedListName, selectedTasksForDeletion)){
            alert("Successfully deleted the task!")
            selectedTasks = []
            showTasks = !showTasks;
        }else{
            alert("Failed to delete the task")
        }
        
    }
    function actionBeforeEditTask(selectedTaskForEdit){
        if (TaskOptionComponent.toggleEditTask(selectedTaskForEdit[0][0], selectedTaskForEdit[0][1].taskName,selectedTaskForEdit[0][1].taskDescription, selectedTaskForEdit[0][1].taskComplete)){
            selectedTasks = []
            showTasks = !showTasks;
        }
        
    }
    function actionBeforeMoveTask(selectedListName, selectedTasksToBeMoved){
        if (ViewMoveTaskToListComponent.toggle(selectedListName, selectedTasksToBeMoved)){
            selectedTasks = []
            showTasks = !showTasks;
        }
        
    }

    function addTask(){
        TaskOptionComponent.toggle();
        showTasks = !showTasks
    }

    export async function toggleShowTasks(listName){
        selectedListName = listName
        selectedTasks = []
        showTasks = !showTasks;
        if (showTasks){
            resultTasks = await getAllTasks(listName);
        }
    }
</script>

<Styles/>

<div>
    <Modal body header="Tasks" isOpen={showTasks}>
        <Table responsive>
            <thead>
              <tr>
                <th></th>
                <th>Task Name</th>
                <th>Task Description</th>
                <th>Task Deadline</th>
                <th>Task Complete</th>
              </tr>
            </thead>
            <tbody>
            {#each resultTasks as item (item[0])}
                <tr>
                    <td><Input type="checkbox" on:change={addSelectedTasksToList(item)}/></td>             
                    <td>{item[1].taskName}</td>
                    <td>{item[1].taskDescription}</td>
                    <td>{ TaskOptionComponent.convertTimestampToDate(item[1].taskDeadline)}</td>
                    {#if item[1].taskComplete}
                        <td><Icon name="check-circle-fill" /></td>
                    {:else}
                        <td><Icon name="circle" /></td>
                    {/if}
                </tr>
            {/each}

            </tbody>
        </Table>
        <ModalFooter>
            {#if !selectedTasks.length}
                <Button disabled color="primary" on:click={() => actionBeforeDeleteTasks(selectedListName,selectedTasks)}>Remove task</Button>
                <Button disabled color="primary" on:click={() => actionBeforeMoveTask(selectedListName,selectedTasks)}>Move task</Button>
            {:else}
                <Button color="primary" on:click={() => actionBeforeDeleteTasks(selectedListName,selectedTasks)}>Remove task</Button>
                <Button color="primary" on:click={() => actionBeforeMoveTask(selectedListName,selectedTasks)}>Move task</Button>
            {/if}
            {#if selectedTasks.length == 1}
                <Button color="primary" on:click={() => actionBeforeEditTask(selectedTasks)}>Edit task</Button>
            {:else}
                <Button disabled color="primary" on:click={() => actionBeforeEditTask(selectedTasks)}>Edit task</Button>
            {/if}
            
            <Button color="primary" on:click={() => addTask()}>Add task</Button>
            <Button color="secondary" on:click={() => toggleShowTasks()}>Close</Button>
        </ModalFooter>

      
    </Modal>
    <TaskOption bind:this={TaskOptionComponent} listName={selectedListName}/>
    <ViewMoveTaskToList bind:this={ViewMoveTaskToListComponent}/>
</div>
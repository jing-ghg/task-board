<script>
    import { getAllLists, moveTask } from "./firebase";
    import { Styles, Modal, ModalFooter, Button, ListGroup, ListGroupItem } from "sveltestrap";
    let open = false;
    let result = [];
    let originListName;
    let tasksToBeMoved;
    export async function toggle(selectedListName, selectedTasksToBeMoved){
      open = !open;
      originListName = selectedListName;
      tasksToBeMoved = selectedTasksToBeMoved;

      if (open){
        result = await getAllLists();

      }
  }
  function preMoveTask(destinationList){
      if (destinationList === originListName){
          alert("Cannot move to the same list!")
      }
        else if (moveTask(originListName,destinationList,tasksToBeMoved)){
            open = !open;
            alert("Successfully moved the task!");
        }else{
            alert("Failed to move the task");
        }
        
        
    }

</script>

<Styles/>

<div>
    <Modal body header="Please select the destination list" isOpen={open}>
        <ListGroup>
            {#each result as item (item[0])}
                <ListGroupItem on:click={() => preMoveTask(item[0])} action>{item[0]}</ListGroupItem>

            {/each}
        </ListGroup>

      <ModalFooter>
        <Button color="primary" on:click={toggle}>Close</Button>
      </ModalFooter>
    </Modal>

</div>
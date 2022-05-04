<script>
    import { getAllLists, deleteList } from "./firebase";
    import { Col, Container, Row, Styles, Modal, Icon, ModalFooter, Button, ListGroup, ListGroupItem } from "sveltestrap";
    import ViewTask from "./viewTask.svelte";
    let open = false;
    let result = [];
    let ViewTaskComponent;
    export async function toggle(){
      open = !open;
      if (open){
          result = await getAllLists();

      }
  }
    function toggleDelete(list){
        if (deleteList(list)){
            open = false;
            alert("Successfully deleted the list!")
        }else{
            alert("Failed to delete the task")
        }
        
    }

</script>

<Styles/>

<div>
    <Modal body header="List" isOpen={open}>
        <ListGroup>
            {#each result as item (item[0])}
                    <ListGroupItem action>
                        <Container>
                            <Row>
                                <Col><div on:click={()=>ViewTaskComponent.toggleShowTasks(item[0])} action>{item[0]}</div></Col>
                                <Col><Icon style="float:right;" onclick={()=>toggleDelete(item[0])} name="trash-fill" /></Col>
                            </Row>
                        </Container>
                    </ListGroupItem>
            {/each}
        </ListGroup>

      <ModalFooter>
        <Button color="primary" on:click={toggle}>Close</Button>
      </ModalFooter>
    </Modal>
    <ViewTask bind:this={ViewTaskComponent}/>
</div>


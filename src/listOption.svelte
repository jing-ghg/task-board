<script>
    import {
    Styles,
    Button,
    Modal,
    ModalFooter,
    Form, FormGroup, Input, Alert
  } from 'sveltestrap';
  import {addNewList, checkIfListExist} from './firebase.js'
  let open = false;
  export function toggle(){
      isListNameEmpty = false;
      listName = ""
      isListNameExist = false;
      isOperationSuccessful = "none";
      open = !open;
  }
  let listName;
  
  let isListNameEmpty = false;
  let isListNameExist = false;
  let isOperationSuccessful = "none";

  // Check if the list name is empty or the name has already existed
  async function checkCondition(){
    isListNameEmpty = false;
    isListNameExist = false;

      if (listName.trim() === ""){
          isListNameEmpty = true;
      }else if(await checkIfListExist(listName) === true){
    
            isListNameExist = true;

      }
      else{
        
          if (await addNewList(listName)){
            toggle();
            isOperationSuccessful = "true"
          }else{
            toggle();
            isOperationSuccessful = "false"
          }
          
      }
  }


</script>
<Styles/>

<div>
    {#if isOperationSuccessful === "true"}
        <Alert color="info" dismissible>List is successfully created!</Alert>
    {:else if isOperationSuccessful === "false"}
        <Alert color="danger" dismissible>Something is wrong, please try again</Alert>
    {/if}
    <Modal body header="List Setup" isOpen={open}>
        {#if isListNameEmpty}
            <p style="color:red;">List name cannot be empty</p>
        {/if}
        {#if isListNameExist}
            <p style="color:red;">List name has already been used</p>
        {/if}
        <Form>
            <FormGroup floating label="List Name (*required)">
                <Input bind:value={listName} />
            </FormGroup>          
        </Form>

      <ModalFooter>
        <Button color="primary" on:click={checkCondition}>Submit</Button>
        <Button color="secondary" on:click={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  </div>
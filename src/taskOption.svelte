<script context="module">
        export function convertTimestampToDate(timestamp){
        
        timestamp = timestamp ?? Timestamp.now()
        let obj = new Timestamp(timestamp.seconds,timestamp.nanoseconds)
        return obj.toDate()

    }
</script>
<script>
    import {
    Styles,
    Button,
    Modal,
    ModalFooter,
    Form, FormGroup, Input, Label
  } from 'sveltestrap';
  import { addNewTask, editTask } from "./firebase.js"
  import { Timestamp } from "@firebase/firestore"
  let open = false;
  export function toggle(){
        isTaskNameEmpty = false;
        isTaskDescriptionEmpty = false;
        isTaskDeadlineEmpty = false;
        isTaskCompleted = false;
        taskName = "";
        taskDescription = "";
        taskDeadline = null;
        taskId = "";
        editOrAddTask = "add";
        open = !open;
  }
  export function toggleEditTask(id, Name, Description, isCompleted){
        isTaskNameEmpty = false;
        isTaskDescriptionEmpty = false;
        isTaskDeadlineEmpty = false;
        taskName = Name;
        taskDescription = Description;
        taskId = id;
        isTaskCompleted = isCompleted;
        editOrAddTask = "edit";
        open = !open;
  }
  export let listName;
  let taskId = "";
  let taskName = "";
  let taskDescription = "";
  let taskDeadline = null;


  let isTaskCompleted = false;
  let isTaskNameEmpty = false;
  let isTaskDescriptionEmpty = false;
  let isTaskDeadlineEmpty = false;
  let editOrAddTask = "";
  
    export function convertTimestampToDate(timestamp){
        
        timestamp = timestamp ?? Timestamp.now()
        let obj = new Timestamp(timestamp.seconds,timestamp.nanoseconds)
        return obj.toDate()

    }
    


    function changeTaskCompleteStatus(){
        isTaskCompleted = !isTaskCompleted;
   

    }

    // Check if the task name, task description and task deadline inputs are filled
    // Check if 'add task' or 'edit task' action should be executed
  async function checkCondition(){
        isTaskNameEmpty = false;
        isTaskDescriptionEmpty = false;
        isTaskDeadlineEmpty = false;

      if (taskName.trim() === ""){
          isTaskNameEmpty = true;
      }
      else if (taskDescription.trim() === ""){
          isTaskDescriptionEmpty = true;
      }
      else if (taskDeadline==null){
          isTaskDeadlineEmpty = true;
      }
      else{
        if (editOrAddTask == "add"){
            if (await addNewTask(listName, taskName, taskDescription, taskDeadline, isTaskCompleted)){
                if (isTaskCompleted){
                    console.log("Task "+ taskName +" is completed!");
                }
                
                toggle();
                alert("Task is added successfully!");
          }else{
            alert("Task failed to be added. Please try again.")
            
          }
        }else{
            if (await editTask(listName, taskId, taskName, taskDescription, taskDeadline, isTaskCompleted)){
                if (isTaskCompleted){
                    alert("Task "+ taskName +" is completed!");
                    console.log("Task "+ taskName +" is completed!");
                }
                
                toggle();
                alert("Successfully edited the task!")
           
          }else{
            alert("Edit failed. Please try again.")

          }
        }
        
      }
  }


</script>
<Styles/>

<div>


    <Modal body header="Task Setup" isOpen={open}>
        <Form>
            {#if isTaskNameEmpty}
                <p style="color:red;">Task name cannot be empty</p>
            {/if}
            <FormGroup>
                <Label for="taskName">Task Name</Label>
                <Input id="taskName" bind:value={taskName} placeholder={taskName} />
            </FormGroup>
            {#if isTaskDescriptionEmpty}
                <p style="color:red;">Task description cannot be empty</p>
            {/if}
            <FormGroup>
                <Label for="taskDescription">Task Description</Label>
                <Input id="taskDescription" bind:value={taskDescription} placeholder={taskDescription} />
            </FormGroup>
            {#if isTaskDeadlineEmpty}
                <p style="color:red;">Task deadline cannot be empty</p>
            {/if}
            <FormGroup>
                <Label for="taskDeadline">Task Deadline</Label>
                <Input
                    bind:value={taskDeadline}
                    type="datetime-local"
                    name="datetime"
                    id="taskDeadline"
                    
                />
            
            </FormGroup>
            <FormGroup>
                {#if editOrAddTask==="edit" && isTaskCompleted}
                    <Input checked type="checkbox" label="This task is completed" on:change={()=>changeTaskCompleteStatus()}/>
                {:else}
                    <Input type="checkbox" label="This task is completed" on:change={()=>changeTaskCompleteStatus()}/>
                {/if}
            </FormGroup>
            
          
        </Form>

      <ModalFooter>
        <Button color="primary" on:click={checkCondition}>Submit</Button>
        <Button color="secondary" on:click={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  </div>
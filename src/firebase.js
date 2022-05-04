
import { initializeApp } from "firebase/app";
import { writeBatch ,getFirestore, collection, setDoc, doc, getDoc, getDocs, query, where, addDoc, Timestamp, deleteDoc, updateDoc } from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyAF5f2wAjujeKxDplwgm62z_MorSDx7waM",
    authDomain: "delvify-2eaf2.firebaseapp.com",
    projectId: "delvify-2eaf2",
    storageBucket: "delvify-2eaf2.appspot.com",
    messagingSenderId: "537821094530",
    appId: "1:537821094530:web:3813317844ebd44f054a9b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export async function addNewList(listName){
    try{
    await setDoc(doc(db, "user", listName),{
        dummy: null
      });

    return true
  } catch (e) {
    console.log(e)
    return false
  }} 

export async function addNewTask(listName, taskName, taskDescription, taskDeadline, taskCompleteStatus){
  try{
    let deadline = Timestamp.fromDate(new Date(taskDeadline));
  await addDoc(collection(db, "user", listName, "taskList"),{
      taskName: taskName,
      taskDescription: taskDescription,
      taskDeadline: deadline,
      taskComplete: taskCompleteStatus
    });

  return true
} catch (e) {
  console.log(e)
  return false
}}

export async function deleteTasks(listName, task){
  for (let i=0; i<task.length; i++){
    try{
      await deleteDoc(doc(db, "user", listName, "taskList",task[i][0]));

    } catch (e){
      console.log(e)
      return false
    }
    
  }
  return true

  
}

export async function editTask(listName, taskId, taskName, taskDescription, taskDeadline, taskCompleteStatus){
    try{
      let deadline = Timestamp.fromDate(new Date(taskDeadline));
      await updateDoc(doc(db, "user", listName, "taskList",taskId),{
        taskName: taskName,
        taskDescription: taskDescription,
        taskDeadline: deadline,
        taskComplete: taskCompleteStatus
      });

    } catch (e){
      console.log(e)
      return false
    }
    
  return true

  
}

export async function moveTask(originalListName, destinationListName, tasksToBeMoved){
 
  try{
    const batch = writeBatch(db);
    for (let i = 0; i<tasksToBeMoved.length; i++){
    batch.set(doc(db, "user", destinationListName, "taskList",tasksToBeMoved[i][0]),{
      taskName: tasksToBeMoved[i][1].taskName,
      taskDescription: tasksToBeMoved[i][1].taskDescription,
      taskDeadline: tasksToBeMoved[i][1].taskDeadline,
      taskComplete: tasksToBeMoved[i][1].taskComplete
    });
    batch.delete(doc(db, "user", originalListName, "taskList",tasksToBeMoved[i][0]))
  }
    batch.commit()
  }
  
  catch (e){
    console.log(e)
    return false
  }
  
return true


}



export async function checkIfListExist(listName){
  
  const docRef = await getDoc(doc(db,"user", listName));

  if (docRef.exists()){
    return true
  }
  else{
    return false
  }
}

export async function getAllLists(){

  let result = []
  const querySnapshot = await getDocs(collection(db, "user"));
  querySnapshot.forEach((doc) => {
 
    result.push([doc.id, doc.data()])
  });
  return result
}



export async function getAllTasks(listName){
  let result = []
  const querySnapshot = await getDocs(collection(db, "user",listName, "taskList"));
  querySnapshot.forEach((doc) => {
    result.push([doc.id, doc.data()])
  });
  return result
}

export async function getAllListsForDeadlineChecking(){
  let resultList = []
  try{
    
    const querySnapshot = await getDocs(collection(db, "user"));
    querySnapshot.forEach((doc) => {
      resultList.push([doc.id])
    });
  }catch(e){
    console.log(e)
    return []
  }
return resultList
}

// Get all tasks that have not been completed yet
export async function getAllTasksWithoutComplete(resultList){

  try{
    for (let i = 0; i<resultList.length; i++){
    
      const snapshot = await getDocs(query(collection(db, "user",resultList[i][0], "taskList"),where("taskComplete", "==", false)));

      snapshot.forEach((doc) => {
        resultList[i].push([doc.data().taskName,doc.data().taskDeadline])
      });
    }
  }catch(e){
    console.log(e)
    return []
  }

  return resultList
}


export async function deleteList(listName){
  try{
    const querySnapshot = await getDocs(collection(db, "user",listName, "taskList"));
    const batch = writeBatch(db);
    querySnapshot.forEach((document) => {
      
      batch.delete(doc(db, "user", listName, "taskList",document.id))
    
    });
    batch.delete(doc(db,"user",listName))
    batch.commit()
    return true

  }catch(e){
    console.log(e)
    return false
   
  }

}










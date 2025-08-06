import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import getAxiosClient from "../axios-instance";

export default function Todos(){
  const modalRef = useRef();
  const queryClient = useQueryClient();

  const { mutate: createNewTodo } = useMutation({
	  // The key used to identify this mutation in React Query's cache
	  mutationKey: ["newTodo"],
	
	  // The function that performs the mutation (i.e., creating a new to-do)
	  mutationFn: async (newTodo) => {
	    const axiosInstance = await getAxiosClient();
	
	    // Use the Axios instance to make a POST request to the server, sending the new to-do data
	    const { data } = await axiosInstance.post("http://localhost:8080/todos", newTodo);
	
	    // Return the response data (e.g., the newly created to-do object)
	    return data;
	  },
    onSuccess: () => {
	    queryClient.invalidateQueries("todos");
	  }
  });

  //New mutation that will make PUT requests to server, edit a specific todo and mark it as complete
  const { mutate: markAsCompleted } = useMutation({
    mutationKey: ["markAsCompleted"],
    mutationFn: async (todoId) => {
      const axiosInstance = await getAxiosClient(); 

        const { data } = await axiosInstance.put(`http://localhost:8080/todos/${todoId}/completed`);

        return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    }
  });

  const { data, isError, isLoading } = useQuery({
    // A unique key to identify this query in React Query's cache
    queryKey: ["todos"],

    // The function responsible for fetching the data
    queryFn: async () => {
      const axiosInstance = await getAxiosClient();

      // Use the Axios instance to send a GET request to fetch the list of todos
      const { data } = await axiosInstance.get("http://localhost:8080/todos");

      // Return the fetched data (React Query will cache it under the queryKey)
      return data;
    },
  });

  //handler to determine when to toggle the modal on and off
  const toggleNewTodoModal = () => {
    // Check if the modal is currently open by accessing the `open` property of `modalRef`.
    if (modalRef.current.open) {
      // If the modal is open, close it by calling the `close()` method.
      modalRef.current.close();
    } else {
      // If the modal is not open, open it by calling the `showModal()` method.
      modalRef.current.showModal();
    }
  }

  const { register, handleSubmit } = useForm({ 
    defaultValues: { 
      name: "", 
      description: "" 
    } 
  });

  //check if the client is still waiting for a response from the remote resource
  if(isLoading){
    return (
      <div>Loading Todos...</div>
    )
  }
  //check if an error occured while fetching data
  if(isError){
    return (
      <div>There was an error</div>
    )
  }
  console.log(data);

  const handleNewTodo = (values) => {
    createNewTodo(values);
    toggleNewTodoModal();
    console.log(values)
  }

  //NewTodoButton component
  function NewTodoButton() {
    return (
      <button className="btn text-white btn-primary" onClick={toggleNewTodoModal}>
        New Todo
      </button>
    )
  }

  //TodoModal component
  function TodoModal() {
    return (
     <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">New Todo</h3>
          <form onSubmit={handleSubmit(handleNewTodo)}>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Name of Todo</span>
              </div>
              <input type="text" placeholder="Type here" className="input input-bordered w-full" {...register("name")} />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Description</span>
              </div>
              <input type="text" placeholder="Type here" className="input input-bordered w-full" {...register("description")} />
            </label>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Create Todo</button>
              <button type="button" onClick={toggleNewTodoModal} className="btn btn-ghost">Close</button>
            </div>
          </form>
        </div>
      </dialog>
    )
  }
  
  function TodoItemList() {
    return (
    <div className="w-lg h-sm flex column items-center justify-center gap-4">
    {data.success && data.todos && data.todos.length >= 1 ? (
      <ul className="flex flex-col items-center justify-center gap-4">
        {
          data.todos.map(todo => (
            <li key={todo.id} className="text-white inline-flex items-center gap-4 ">
              <div className="w-md">
                <h3 className="text-lg">
                  {todo.name}
                </h3>
                <p className="text-sm">{todo.description}</p>
              </div>
              <div className="w-md">
                <label className="swap">
                <input type="checkbox" onClick={() => markAsCompleted(todo.id)} />
                  <div className="swap-on">
                    Yes
                  </div>
                  <div className="swap-off">
                    No
                  </div>
                </label>
              </div>
            </li>
          ))
        }
      </ul>
    ) : (
      <div>
        <p>Data missing & Conditions not met. </p>
      </div>
    )}
    </div>
  )
  }
  return (
    <>
    <NewTodoButton />
    <TodoItemList />
    <TodoModal />
    </>
  )
}

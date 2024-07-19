import axios from "axios";
import "./App.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


function App() {
  const queryClient = useQueryClient();

  const {data,error,isLoading} = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      axios
        .get("https://jsonplaceholder.typicode.com/posts")
        .then((res) => res.data),

        staleTime: 4000,
        //refetchInterval: 4000,
        refetchOnWindowFocus:false,
        retry:5
  });
  //const id = data.id
 
  // const { isLoading, error, data } = useQuery({
  //   queryKey: ["posts"],
  //   queryFn: () =>
  //     axios
  //       .get("https://jsonplaceholder.typicode.com/posts")
  //       .then((res) => res.data),

  //       staleTime: 3000,
  //       //refetchInterval: 4000,
  //       enabled: !!id, //not null and true(convert into boolean)
  // });

  console.log(error);
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: (newPost) =>
       axios.post("https://jsonplaceholder.typicode.com/posts", newPost, {
          // method: "POST",
          // body: JSON.stringify(newPost),

          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
        .then((res) => res.data),
        onSuccess: (newPost) =>{
           //queryClient.invalidateQueries({queryKey:["posts"]})
          queryClient.setQueryData(['posts'],(oldPosts)=>[...oldPosts,newPost]);
        }
  });
  //conditions of UI before the data gets loaded/fetched
  if (isLoading) return <>Loading...</>;
  if (error || isError) return <>Error loading data</>;
  
  return (
    <div className="App">
      {isPending && <p>DATA IS BEING ADDED..</p>}
      <button
      style={{'cursor':'pointer'}}
        onClick={() =>
          mutate({
            userId: 5000,
            id: 4000,
            title: "Proxy Title",
            body: "Proxy body to demonstrate POST command/mutation in axios using REACT query",
          })
        }
      >
        Add Post
      </button>
      {/* {data?.slice(0,10).map((todo)=>( */}
      {/* {data.slice(0, 10).map((todo) => ( */}

      {data.map((todo) => (
        <div key={todo.id}>
          <h4>ID:{todo.id}</h4>
          <h4>Title:{todo.title}</h4>
          <p>Body:{todo.body}</p>
        </div>
      ))}
    </div>
  );
}

export default App;

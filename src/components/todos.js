import React, { useState, useEffect } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { db } from "../firebase";
import Todo from "./Todo";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const { user } = useUserAuth();

  useEffect(() => {
    const unsubscribe = db
      .collection("todos")
      .where("userId", "==", user.uid)
      .onSnapshot((snapshot) => {
        const fetchedTodos = [];
        snapshot.forEach((doc) => {
          fetchedTodos.push({ ...doc.data(), id: doc.id });
        });
        setTodos(fetchedTodos);
      });

    return () => unsubscribe();
  }, [user]);

  const createTodo = async () => {
    await db.collection("todos").add({
      title: newTodo,
      description: newDescription,
      userId: user.uid,
      createdAt: new Date(),
    });
    setNewTodo("");
    setNewDescription("");
  };

  const deleteTodo = async (id) => {
    await db.collection("todos").doc(id).delete();
  };

  const updateTodo = async (id, updatedTodo) => {
    await db.collection("todos").doc(id).update(updatedTodo);
  };

  return (
    <div>
      <h1>Todos</h1>
      <form>
        <input
          type="text"
          placeholder="Title"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button onClick={createTodo}>Create Todo</button>
      </form>
      {todos.map((todo) => (
        <Todo
          key={todo.id}
          todo={todo}
          onDelete={() => deleteTodo(todo.id)}
          onUpdate={(updatedTodo) => updateTodo(todo.id, updatedTodo)}
        />
      ))}
    </div>
  );
};

export default Todos;
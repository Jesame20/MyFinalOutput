import React, { useState, useEffect } from "react";
import './TodoList.css';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase"; // Ensure you have this file set up as shown in your code

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // Fetch todos from Firestore on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      const querySnapshot = await getDocs(collection(db, "todos"));
      const todosArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTodos(todosArray);
    };

    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (input.trim()) {
      const docRef = await addDoc(collection(db, "todos"), {
        title: input.trim(),
        completed: false,
      });
      setTodos([...todos, { id: docRef.id, title: input.trim(), completed: false }]);
      setInput("");
    }
  };

  const toggleCompleted = async (id) => {
    const todoRef = doc(db, "todos", id);
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      await updateDoc(todoRef, { completed: !todo.completed });
      setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    }
  };

  const updateTodo = async (id, newTitle) => {
    const todoRef = doc(db, "todos", id);
    await updateDoc(todoRef, { title: newTitle });
    setTodos(todos.map(t => t.id === id ? { ...t, title: newTitle } : t));
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
    setTodos(todos.filter(t => t.id !== id));
  };

  const TodoItem = ({ todo, onUpdateTodo, onDeleteTodo }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(todo.title);

    const handleEditing = () => {
      setIsEditing(true);
    };

    const handleEditedTitle = (e) => {
      setEditedTitle(e.target.value);
    };

    const handleSaveEditedTitle = () => {
      onUpdateTodo(todo.id, editedTitle);
      setIsEditing(false);
    };

    const handleDelete = () => {
      onDeleteTodo(todo.id);
    };

    return (
      <li>
        {isEditing ? (
          <>
            <input value={editedTitle} onChange={handleEditedTitle} />
            <button className="save-button" onClick={handleSaveEditedTitle}>Save</button>
          </>
        ) : (
          <>
            <span onClick={() => toggleCompleted(todo.id)} style={{ textDecoration: todo.completed ? "line-through" : "none" }}>{todo.title}</span>
            <div className="button-group">
              <button className="edit-button" onClick={handleEditing}>Edit</button>
              <button className="delete-button" onClick={handleDelete}>Delete</button>
              <button className="complete-button" onClick={() => toggleCompleted(todo.id)}>
                {todo.completed ? "Undo" : "Complete"}
              </button>
            </div>
          </>
        )}
      </li>
    );
  };

  return (
    <div className="todo-container">
      <div className="todo-header">
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdateTodo={updateTodo}
            onDeleteTodo={deleteTodo}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;

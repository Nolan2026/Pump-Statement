import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addTodo,
  deleteTodo,
  toggleStrike,
  editTodo
} from "../todoslices";
import {
  FaCheckCircle,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaClipboardList,
  FaInbox
} from "react-icons/fa";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import ConfirmModal from "../Components/ConfirmModal";
import "../Styles/Todo.css";

export default function Todo() {
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  // Save todos to localStorage on every update (auto-save handled by Store.js)
  // This is redundant but kept for backward compatibility
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAdd = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    if (editId !== null) {
      // Save edited todo
      dispatch(editTodo({ id: editId, newText: input }));
      setEditId(null);
    } else {
      // Add new todo
      dispatch(
        addTodo({
          id: Date.now(),
          text: input,
          striked: false,
        })
      );
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const handleDelete = (todo) => {
    setTodoToDelete(todo);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (todoToDelete) {
      dispatch(deleteTodo(todoToDelete.id));
      setTodoToDelete(null);
      setShowDeleteModal(false); // Close modal after deletion
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTodoToDelete(null);
  };

  const completedCount = todos.filter(todo => todo.striked).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="todo-container">
      <h1 className="todo-title">
        <FaClipboardList className="todo-title-icon" />
        My To-Do List
      </h1>

      {/* Input + Add */}
      <div className="todo-input-section">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="todo-input"
        />

        <button onClick={handleAdd} className="todo-add-btn">
          {editId ? (
            <>
              <FaSave /> Save
            </>
          ) : (
            <>
              <FaPlus /> Add Task
            </>
          )}
        </button>
      </div>

      {/* Todo List */}
      {todos.length === 0 ? (
        <div className="todo-empty">
          <FaInbox className="todo-empty-icon" />
          <p>No tasks yet. Add one to get started!</p>
        </div>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <div className={`todo-text ${todo.striked ? 'striked' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.striked}
                  onChange={() => dispatch(toggleStrike(todo.id))}
                  className="todo-checkbox"
                />
                {todo.text}
              </div>

              <div className="todo-actions">
                {/* Edit */}
                <button
                  onClick={() => {
                    setInput(todo.text);
                    setEditId(todo.id);
                  }}
                  className="todo-btn todo-btn-edit"
                  title="Edit task"
                >
                  <FaEdit /> Edit
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(todo)}
                  className="todo-btn todo-btn-delete"
                  title="Delete task"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Stats */}
      {todos.length > 0 && (
        <div className="todo-stats">
          <div className="todo-stat">
            <div className="todo-stat-number">{todos.length}</div>
            <div className="todo-stat-label">Total Tasks</div>
          </div>
          <div className="todo-stat">
            <div className="todo-stat-number">{activeCount}</div>
            <div className="todo-stat-label">Active</div>
          </div>
          <div className="todo-stat">
            <div className="todo-stat-number">{completedCount}</div>
            <div className="todo-stat-label">Completed</div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Task?"
        message={todoToDelete ? `Are you sure you want to delete "${todoToDelete.text}"? This action cannot be undone.` : ""}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

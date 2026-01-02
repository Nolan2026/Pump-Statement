import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addTodo,
  deleteTodo,
  toggleStrike,
  editTodo,
  saveListToRedux,
  clearAllTodos
} from "../todoslices";
import {
  FaCheckCircle,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaClipboardList,
  FaInbox,
  FaCalendarAlt,
  FaHistory,
  FaCaretRight
} from "react-icons/fa";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import ConfirmModal from "../Components/ConfirmModal";
import "../Styles/Todo.css";

export default function Todo() {
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  // Selectors with fallback for state migration (handle if state.todos is still an array)
  const todos = useSelector((state) => {
    if (Array.isArray(state.todos)) return state.todos;
    return state.todos.items || [];
  });

  const savedSnapshots = useSelector((state) => {
    if (Array.isArray(state.todos)) return [];
    return state.todos.saved || [];
  });

  const dispatch = useDispatch();

  // Current Date
  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Save COMPLETE state (items + saved) to localStorage on every update
  useEffect(() => {
    const stateToSave = {
      items: todos,
      saved: savedSnapshots
    };
    localStorage.setItem("todos", JSON.stringify(stateToSave));
  }, [todos, savedSnapshots]);

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
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTodoToDelete(null);
  };

  // Save Feature: Save current list as a snapshot
  const handleSaveClick = () => {
    setShowSaveModal(true);
  };

  const confirmSave = () => {
    dispatch(saveListToRedux());
    setShowSaveModal(false);
    alert("Current list saved to history!");
  };

  const cancelSave = () => {
    setShowSaveModal(false);
  };

  const handleClearClick = () => {
    setShowClearModal(true);
  };

  const confirmClear = () => {
    dispatch(clearAllTodos());
    setShowClearModal(false);
  };

  const cancelClear = () => {
    setShowClearModal(false);
  };

  const completedCount = todos.filter(todo => todo.striked).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="todo-container">
      <div className="todo-header-row">
        <h1 className="todo-title">
          <FaClipboardList className="todo-title-icon" />
          My To-Do List
        </h1>
        <div className="todo-date-label">
          <FaCalendarAlt /> {currentDate}
        </div>
      </div>

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
              <FaSave /> Update
            </>
          ) : (
            <>
              <FaPlus /> Add
            </>
          )}
        </button>
      </div>

      {/* Save Button */}
      <div className="todo-actions-bar">
        <button onClick={handleSaveClick} className="todo-save-all-btn" title="Save current list to history">
          <FaSave /> Save List
        </button>
        {todos.length > 0 && (
          <button onClick={handleClearClick} className="todo-clear-all-btn" title="Remove all todos">
            <FaTrash /> Clear All
          </button>
        )}
      </div>

      {/* Active Todo List */}
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

      {/* Saved List Section (History) */}
      {savedSnapshots.length > 0 && (
        <div className="saved-list-section">
          <h2 className="saved-list-title">
            <FaHistory /> Saved History (Last 5 Days)
          </h2>

          <div className="saved-snapshots-container">
            {savedSnapshots.map((snapshot, index) => (
              <div key={index} className="saved-snapshot">
                <div className="saved-snapshot-header">
                  <FaCalendarAlt /> {new Date(snapshot.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                </div>
                <ul className="todo-list saved-list">
                  {snapshot.todos.length > 0 ? (
                    snapshot.todos.map((todo) => (
                      <li key={todo.id} className="todo-item saved-item">
                        <div className={`todo-text ${todo.striked ? 'striked' : ''}`}>
                          <FaCheckCircle className="saved-icon" />
                          {todo.text}
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="saved-empty">No tasks saved for this day.</li>
                  )}
                </ul>
              </div>
            ))}
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

      {/* Save Confirmation Modal */}
      <ConfirmModal
        isOpen={showSaveModal}
        onClose={cancelSave}
        onConfirm={confirmSave}
        title="Save to History?"
        message="This will save your CURRENT list as today's entry. Only the last 5 days of history are kept."
        confirmText="Save"
        cancelText="Cancel"
        type="info"
      />

      {/* Clear Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearModal}
        onClose={cancelClear}
        onConfirm={confirmClear}
        title="Clear All Tasks?"
        message="Are you sure you want to remove ALL items from your active list? This cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

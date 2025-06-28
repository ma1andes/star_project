import React, { useEffect, useState } from "react";
import { apiFetch } from "../../shared";
import "./qastyle.css";

export const QA = () => {
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const [qa, setQa] = useState([]);
  const role = localStorage.getItem("role");

  const loadQA = async () => {
    try {
      const data = await apiFetch("/qa/vopr", {
        method: "GET",
        requireAuth: true,
      });
      setQa(data.data);
    } catch (error) {
      console.error("Error loading QA:", error);
    }
  };

  const onSubmitQA = async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch("/qa", {
        method: "POST",
        body: JSON.stringify({ comment, status }),
        requireAuth: true,
      });
      setQa((prevQa) => [...prevQa, data.data]);
      setComment("");
      setStatus("");
    } catch (error) {
      console.error("Error submitting QA:", error);
    }
  };

  const DeleteQA = async (id) => {
    try {
      await apiFetch(`/qa/${id}`, {
        method: "DELETE",
        requireAuth: true,
      });
      setQa((prev) => prev.filter((el) => el.id !== id));
    } catch (error) {
      console.error("Error deleting QA:", error);
    }
  };

  useEffect(() => {
    loadQA();
  }, []);

  return (
    <div className="qa-container">
      {role === "qa" && (
        <form className="qa-form" onSubmit={onSubmitQA}>
          <p>
            опиши ошибку <br />
          </p>
          <textarea
            className="qa-textarea"
            value={comment}
            placeholder="comment"
            onChange={(el) => setComment(el.target.value)}
          />
          <select
            className="qa-select"
            value={status}
            onChange={(el) => setStatus(el.target.value)}
          >
            <option value="" disabled>
              статус
            </option>
            <option value="on_hold">on_hold</option>
            <option value="complete">complete</option>
            <option value="in_progress">in_progress</option>
          </select>
          <button className="qa-button" type="submit">
            Отправить на дев
          </button>
        </form>
      )}
      <h1 className="qa-title">ЗАДАЧИ НАХ</h1>
      {qa.map((q) => (
        <div key={q.id} className="qa-task">
          <h3>task - {q.comment}</h3>
          <h3>status - {q.status}</h3>
          {role === "qa" && (
            <button className="delete-button" onClick={() => DeleteQA(q.id)}>
              delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

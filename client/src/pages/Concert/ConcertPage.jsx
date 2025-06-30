import React, { useEffect, useState } from "react";
import { useUser, apiFetch, CardContainer, Card, ConfirmModal } from "../../shared";
import { CreateConcert } from "./Form/CreateForm/CreateConcert";
import { UpdateConcert } from "./Form/UpdateForm/UpdateConcert";

export const ConcertPage = () => {
  const [concerts, setConcerts] = useState([]);
  const [editingConcert, setEditingConcert] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [concertToDelete, setConcertToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, loading: userLoading } = useUser();

  const getConcerts = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/concerts", {
        method: "GET",
        requireAuth: false,
      });
      setConcerts(data.data);
    } catch (error) {
      console.error("Error loading concerts:", error);
      setConcerts([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteConcert = async (id) => {
    try {
      await apiFetch(`/concert/${id}`, {
        method: "DELETE",
        requireAuth: true,
      });
      setConcerts((prevConcerts) =>
        prevConcerts.filter((concert) => concert.id !== id)
      );
    } catch (error) {
      console.error("Error deleting concert:", error);
    }
  };

  const updateConcert = (concert) => {
    setEditingConcert(concert);
  };

  const handleConcertUpdate = () => {
    getConcerts();
  };

  const closeUpdateModal = () => {
    setEditingConcert(null);
  };

  const confirmDelete = (concert) => {
    setConcertToDelete(concert);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (concertToDelete) {
      await deleteConcert(concertToDelete.id);
      setIsConfirmOpen(false);
      setConcertToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setConcertToDelete(null);
  };

  useEffect(() => {
    getConcerts();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        marginTop: "20px",
      }}
    >
      {!userLoading && user?.role === "admin" && (
        <CreateConcert onCreateConcert={getConcerts} />
      )}

      <h1>КОНЦЕРТЫ</h1>

      {loading && <p>Загрузка концертов...</p>}

      <CardContainer>
        {concerts.map((concert) => (
          <Card
            key={concert.id}
            style={{ border: "1px solid pink", borderRadius: "10px" }}
          >
            <h2>Название концерта: {concert.title}</h2>
            <h3>Место: {concert.city_name}</h3>
            <p>
              Время: {new Date(`1970-01-01T${concert.time}`).toLocaleTimeString()}
            </p>
            <p>Дата: {new Date(concert.date).toLocaleDateString("ru-RU")}</p>

            {!userLoading && user?.role === "admin" && (
              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => updateConcert(concert)}
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Изменить
                </button>
                <button
                  onClick={() => confirmDelete(concert)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Удалить
                </button>
              </div>
            )}
          </Card>
        ))}
      </CardContainer>

      {editingConcert && (
        <UpdateConcert
          concertData={editingConcert}
          onUpdateConcert={handleConcertUpdate}
          onClose={closeUpdateModal}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Удалить концерт"
        message={`Вы уверены, что хотите удалить концерт "${concertToDelete?.title}"?`}
      />
    </div>
  );
};

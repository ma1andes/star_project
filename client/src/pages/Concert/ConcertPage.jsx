import React, { useEffect, useState } from "react";
import { apiFetch } from "../../shared";

export const ConcertPage = () => {
  const [concert, setConcert] = useState([]);
  const getConcert = async () => {
    try {
      const data = await apiFetch("/concerts", {
        method: "GET",
        requireAuth: false,
      });
      console.log(data);
      setConcert(data.data);
    } catch (error) {
      console.error("Error loading concerts:", error);
    }
  };

  useEffect(() => {
    getConcert();
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
      {concert.map((item) => (
        <div
          key={item.id}
          style={{ border: "1px solid pink", borderRadius: "10px" }}
        >
          <p>Название концерта: {item.title}</p>
          <p>Место: {item.place}</p>
          <p>
            Время: {new Date(`1970-01-01T${item.time}`).toLocaleTimeString()}
          </p>
          <p>Дата: {new Date(item.date).toLocaleDateString("ru-RU")}</p>
        </div>
      ))}
    </div>
  );
};

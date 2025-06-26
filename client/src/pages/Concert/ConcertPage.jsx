import React, { useEffect, useState } from "react";

export const ConcertPage = () => {
  const [concert, setConcert] = useState([]);
  const getConcert = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/concerts", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setConcert(data.data);
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

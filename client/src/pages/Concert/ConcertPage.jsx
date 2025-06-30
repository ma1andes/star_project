import React, { useEffect, useState } from "react";
import { useUser, apiFetch, CardContainer, Card } from "../../shared";
import { CreateConcert } from "./Form/CreateConcert";

export const ConcertPage = () => {
  const [concert, setConcert] = useState([]);
  const { user } = useUser();

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
      {user?.role === "admin" && <CreateConcert onCreateConcert={getConcert} />}
      <CardContainer>
        {concert.map((item) => (
          <Card
            key={item.id}
            style={{ border: "1px solid pink", borderRadius: "10px" }}
          >
            <h2>Название концерта: {item.title}</h2>
            <h3>Место: {item.city_name}</h3>
            <p>
              Время: {new Date(`1970-01-01T${item.time}`).toLocaleTimeString()}
            </p>
            <p>Дата: {new Date(item.date).toLocaleDateString("ru-RU")}</p>
          </Card>
        ))}
      </CardContainer>
    </div>
  );
};

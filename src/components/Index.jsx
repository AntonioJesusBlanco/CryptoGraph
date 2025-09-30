import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Index = () => {
  const [coins, setCoins] = useState([]);
  const [data, setData] = useState({});
  const [activeCharts, setActiveCharts] = useState({}); // Estado para controlar qué gráfico está abierto
  const options = { method: "GET", headers: { accept: "application/json" } };


  const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#181f35ff",
          border: "1px solid #555",
          padding: "8px 12px",
          borderRadius: "8px",
          color: "#c4dafaff",
        }}
      >
        <p style={{ margin: 0, fontWeight: "lighter" }}> 
          {payload[0].payload.date}</p>
        <p style={{ margin: 0, fontWeight: "bold" }}>
         
          Precio: {payload[0].value} €
        </p>
      </div>
    );
  }
  return null;
};
  // 1. Cargar monedas principales (limitamos a 10 para no saturar la API)
  useEffect(() => {
    fetch("/api/coins/markets?vs_currency=usd&per_page=10&page=1", options)
      .then((res) => res.json())
      .then((coins) => setCoins(coins))
      .catch((err) => console.error("Error al cargar monedas:", err));
  }, []);

  // 2. Obtener histórico de precios
  const fetchChart = (coinId, days) => {
    fetch(
      `/api/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
      options
    )
      .then((res) => res.json())
      .then((res) => {
        if (!res.prices) return;

        const chartData = res.prices.map(([timestamp, price]) => {
          const date = new Date(timestamp).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            
          });
          return { date, price: price.toFixed(2) };
        });

        setData((prev) => ({
          ...prev,
          [coinId]: { days, chartData },
        }));

        setActiveCharts((prev) => ({ ...prev, [coinId]: true })); // Abrir gráfico
      })
      .catch((err) => console.error("Error al cargar gráfico:", err));
  };

  // 3. Cerrar gráfico
  const closeChart = (coinId) => {
    setActiveCharts((prev) => ({ ...prev, [coinId]: false }));
  };

  return (
    <div>
      <div id="contenidoInicial">
      <p>Visualiza la evolución de las principales criptomonedas en tiempo real</p>
      <h2 id="titulo">Top 10 criptomonedas</h2>
      </div>
      <ul>
        {coins.map((coin, idx) => (
          <li
            key={coin.id}
            style={{
              marginBottom:
                idx === coins.length - 1 ? "0px" : "100px",
            }}
          >
            <strong>
              {coin.name} ({coin.symbol.toUpperCase()})
            </strong>{" "}
            - Precio actual: {coin.current_price}€
            <div style={{ marginTop: "5px" }}>
              <button onClick={() => fetchChart(coin.id, 1)}>1D</button>{" "}
              <button onClick={() => fetchChart(coin.id, 7)}>7D</button>{" "}
              <button onClick={() => fetchChart(coin.id, 30)}>30D</button>
            </div>

            {/* Gráfico */}
            {data[coin.id] && activeCharts[coin.id] && (
              <div
                style={{
                  marginTop: "20px",
                  height: "300px",
                  marginBottom: "20px",
                  position: "relative",
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                }}
              >
                <h4>Evolución en {data[coin.id].days} días</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
  data={data[coin.id].chartData}
  margin={{ top: 20, right: 30, left: 20, bottom: 30 }} // separa la gráfica de los bordes
>
  <CartesianGrid strokeDasharray="0 1" />
  <XAxis
    dataKey="date"
    tickMargin={10} // separa las etiquetas del eje x del borde inferior
  />
  <YAxis
    domain={["auto", "auto"]}
    tickMargin={10} // separa las etiquetas del eje y del borde izquierdo
  />
 <Tooltip content={<CustomTooltip />} />

  
  <Line type="basis" dataKey="price" stroke="#3575ffff" dot={false} />
</LineChart>
                </ResponsiveContainer>
                <button
                  onClick={() => closeChart(coin.id)}
                  style={{
                    marginTop: "12px",
                    padding: "0.4em 1.2em",
                    borderRadius: "25px",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    background: "#027acaff",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease, transform 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#25afffff")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "#027acaff")
                  }
                >
                  Cerrar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Index;

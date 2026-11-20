import { useState } from "react";

type Avaliacao = {
  id: number;
  nome: string;
  nota: string;
  peso: string;
};

type Campo = keyof Omit<Avaliacao, "id">;

type NotaValida = {
  n: number;
  p: number;
};

const num = (v: string): number | null => {
  const n = parseFloat(String(v).replace(",", "."));
  return isNaN(n) ? null : n;
};
const fmt = (n: number): string => n.toFixed(2).replace(".", ",");
const fmtPeso = (n: number): string => fmt(n).replace(",00", "");

let nextId = 4;

export default function App() {
  const [rows, setRows] = useState<Avaliacao[]>([
    { id: 1, nome: "Prova 1", nota: "", peso: "1" },
    { id: 2, nome: "Prova 2", nota: "", peso: "1" },
    { id: 3, nome: "Trabalho", nota: "", peso: "1" },
  ]);
  const [minima, setMinima] = useState("6");
  const [pesoProx, setPesoProx] = useState("1");

  const update = (id: number, campo: Campo, valor: string) =>
    setRows((rs) =>
      rs.map((r) => (r.id === id ? { ...r, [campo]: valor } : r)),
    );
  const add = () =>
    setRows((rs) => [
      ...rs,
      { id: nextId++, nome: `Avaliação ${rs.length + 1}`, nota: "", peso: "1" },
    ]);
  const remove = (id: number) => setRows((rs) => rs.filter((r) => r.id !== id));

  const validas = rows
    .map((r) => ({ n: num(r.nota), p: num(r.peso) }))
    .filter((r): r is NotaValida => r.n !== null && r.p !== null && r.p > 0);
  const somaPesos = validas.reduce((a, r) => a + r.p, 0);
  const somaPonderada = validas.reduce((a, r) => a + r.n * r.p, 0);
  const media = somaPesos > 0 ? somaPonderada / somaPesos : null;
  const min = num(minima) ?? 6;
  const pp = num(pesoProx);

  let dica = null;
  if (media !== null && pp && pp > 0) {
    const precisa = (min * (somaPesos + pp) - somaPonderada) / pp;
    if (precisa <= 0)
      dica = "Você já garante a média, mesmo tirando 0 na próxima avaliação.";
    else if (precisa > 10)
      dica = `Mesmo com 10 na próxima avaliação (peso ${fmtPeso(pp)}), a média mínima não é alcançada.`;
    else
      dica = `Para chegar a ${fmt(min)}, tire pelo menos ${fmt(precisa)} na próxima avaliação (peso ${fmtPeso(pp)}).`;
  }

  return (
    <main>
      <h1>Média de notas</h1>

      <section className="result" aria-live="polite">
        {media === null ? (
          <p className="hint">Digite ao menos uma nota para ver a média.</p>
        ) : (
          <>
            <span className="big">{fmt(media)}</span>
            <p className={`status ${media >= min ? "ok" : "bad"}`}>
              {media >= min
                ? `Aprovado: média acima de ${fmt(min)}`
                : `Abaixo da média mínima (${fmt(min)})`}
            </p>
            {dica && <p className="hint">{dica}</p>}
          </>
        )}
      </section>

      <section className="panel">
        <div className="scroll">
          <div className="head">
            <span>Avaliação</span>
            <span>Nota</span>
            <span>Peso</span>
            <span />
          </div>
          {rows.map((r) => (
            <div className="row" key={r.id}>
              <input
                value={r.nome}
                aria-label="Nome da avaliação"
                onChange={(e) => update(r.id, "nome", e.target.value)}
              />
              <input
                value={r.nota}
                inputMode="decimal"
                placeholder="0–10"
                aria-label={`Nota de ${r.nome}`}
                onChange={(e) => update(r.id, "nota", e.target.value)}
              />
              <input
                value={r.peso}
                inputMode="decimal"
                aria-label={`Peso de ${r.nome}`}
                onChange={(e) => update(r.id, "peso", e.target.value)}
              />
              <button
                className="del"
                aria-label={`Remover ${r.nome}`}
                onClick={() => remove(r.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button className="add" onClick={add}>
          Adicionar avaliação
        </button>
      </section>

      <section className="panel opts">
        <div>
          <label htmlFor="min">Média mínima</label>
          <input
            id="min"
            value={minima}
            inputMode="decimal"
            onChange={(e) => setMinima(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="pp">Peso da próxima avaliação</label>
          <input
            id="pp"
            value={pesoProx}
            inputMode="decimal"
            onChange={(e) => setPesoProx(e.target.value)}
          />
        </div>
      </section>
    </main>
  );
}

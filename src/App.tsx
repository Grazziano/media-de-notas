import { useState } from "react";

type Avaliacao = {
  id: number;
  nome: string;
  nota: string;
  peso: string;
};

type Campo = keyof Omit<Avaliacao, "id">;

type Linha = {
  n: number;
  p: number | null;
};

type AvaliacaoCalc = Avaliacao & {
  n: number | null;
  p: number | null;
  erroNota: string | null;
  erroPeso: string | null;
};

type TipoMedia = "simples" | "ponderada" | "geometrica" | "harmonica";

const TIPOS: { id: TipoMedia; label: string; kicker: string }[] = [
  {
    id: "simples",
    label: "Aritmética simples",
    kicker: "Média aritmética simples",
  },
  {
    id: "ponderada",
    label: "Aritmética ponderada",
    kicker: "Média aritmética ponderada",
  },
  { id: "geometrica", label: "Geométrica", kicker: "Média geométrica" },
  { id: "harmonica", label: "Harmônica", kicker: "Média harmônica" },
];

const num = (v: string): number | null => {
  const texto = String(v).trim().replace(",", ".");
  if (texto === "") return null;
  const n = Number(texto);
  return Number.isFinite(n) ? n : null;
};
const fmt = (n: number): string => n.toFixed(2).replace(".", ",");
const fmtPeso = (n: number): string => fmt(n).replace(",00", "");

const calcularMedia = (tipo: TipoMedia, dados: Linha[]): number | null => {
  if (dados.length === 0) return null;
  const valores = dados.map((d) => d.n);

  if (tipo === "simples")
    return valores.reduce((a, b) => a + b, 0) / valores.length;

  if (tipo === "ponderada") {
    const comPeso = dados.filter(
      (d): d is { n: number; p: number } => d.p !== null && d.p > 0,
    );
    if (comPeso.length === 0) return null;
    const somaPesos = comPeso.reduce((a, d) => a + d.p, 0);
    const somaPonderada = comPeso.reduce((a, d) => a + d.n * d.p, 0);
    return somaPonderada / somaPesos;
  }

  // Geométrica e harmônica só são definidas para notas positivas.
  if (valores.some((v) => v <= 0)) return null;

  if (tipo === "geometrica") {
    const produto = valores.reduce((a, b) => a * b, 1);
    return Math.pow(produto, 1 / valores.length);
  }

  const somaInversos = valores.reduce((a, b) => a + 1 / b, 0);
  return valores.length / somaInversos;
};

const calcularPrecisa = (
  tipo: TipoMedia,
  dados: Linha[],
  min: number,
  q: number | null,
): number | null => {
  if (dados.length === 0 || min <= 0) return null;
  const valores = dados.map((d) => d.n);
  const k = valores.length;

  if (tipo === "simples") {
    const soma = valores.reduce((a, b) => a + b, 0);
    return min * (k + 1) - soma;
  }

  if (tipo === "ponderada") {
    const comPeso = dados.filter(
      (d): d is { n: number; p: number } => d.p !== null && d.p > 0,
    );
    if (comPeso.length === 0 || q === null || q <= 0) return null;
    const somaPesos = comPeso.reduce((a, d) => a + d.p, 0);
    const somaPonderada = comPeso.reduce((a, d) => a + d.n * d.p, 0);
    return (min * (somaPesos + q) - somaPonderada) / q;
  }

  if (valores.some((v) => v <= 0)) return null;

  if (tipo === "geometrica") {
    const produto = valores.reduce((a, b) => a * b, 1);
    return Math.pow(min, k + 1) / produto;
  }

  const somaInversos = valores.reduce((a, b) => a + 1 / b, 0);
  const denominador = (k + 1) / min - somaInversos;
  return denominador > 0 ? 1 / denominador : Infinity;
};

let nextId = 4;

export default function App() {
  const [rows, setRows] = useState<Avaliacao[]>([
    { id: 1, nome: "Prova 1", nota: "", peso: "1" },
    { id: 2, nome: "Prova 2", nota: "", peso: "1" },
    { id: 3, nome: "Trabalho", nota: "", peso: "1" },
  ]);
  const [minima, setMinima] = useState("6");
  const [pesoProx, setPesoProx] = useState("1");
  const [tipo, setTipo] = useState<TipoMedia>("ponderada");

  const usaPeso = tipo === "ponderada";

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

  const avaliacoes: AvaliacaoCalc[] = rows.map((r) => {
    const notaVazia = r.nota.trim() === "";
    const n = num(r.nota);
    let erroNota: string | null = null;
    if (!notaVazia) {
      if (n === null) erroNota = "Nota inválida.";
      else if (n < 0 || n > 10) erroNota = "A nota deve estar entre 0 e 10.";
    }

    let p: number | null = 1;
    let erroPeso: string | null = null;
    if (usaPeso) {
      const peso = num(r.peso);
      if (r.peso.trim() === "") {
        p = null;
        if (!notaVazia) erroPeso = "Informe o peso desta avaliação.";
      } else if (peso === null || peso <= 0) {
        p = null;
        erroPeso = "O peso deve ser maior que zero.";
      } else {
        p = peso;
      }
    }

    return { ...r, n, p, erroNota, erroPeso };
  });

  const dados: Linha[] = avaliacoes
    .filter(
      (a): a is AvaliacaoCalc & { n: number } =>
        a.n !== null && a.erroNota === null && a.erroPeso === null,
    )
    .map((a) => ({ n: a.n, p: a.p }));

  const media = calcularMedia(tipo, dados);
  const minValor = num(minima);
  const minValido = minValor !== null && minValor > 0;
  const min = minValido ? minValor : 6;
  const minErro = minValido
    ? null
    : `Informe um número maior que zero. Usando ${fmt(6)} no cálculo.`;
  const qValor = usaPeso ? num(pesoProx) : 1;
  const q = qValor !== null && qValor > 0 ? qValor : null;
  const qErro = usaPeso && q === null ? "Informe um peso maior que zero." : null;
  const precisa = media !== null ? calcularPrecisa(tipo, dados, min, q) : null;

  let dica: string | null = null;
  if (precisa !== null) {
    if (precisa <= 0)
      dica = "Você já garante a média, mesmo tirando 0 na próxima avaliação.";
    else if (precisa > 10)
      dica = usaPeso
        ? `Mesmo com 10 na próxima avaliação (peso ${fmtPeso(q as number)}), a média mínima não é alcançada.`
        : "Mesmo com 10 na próxima avaliação, a média mínima não é alcançada.";
    else
      dica = usaPeso
        ? `Para chegar a ${fmt(min)}, tire pelo menos ${fmt(precisa)} na próxima avaliação (peso ${fmtPeso(q as number)}).`
        : `Para chegar a ${fmt(min)}, tire pelo menos ${fmt(precisa)} na próxima avaliação.`;
  }

  const semMedia =
    dados.length > 0 &&
    !usaPeso &&
    (tipo === "geometrica" || tipo === "harmonica");
  const kicker = TIPOS.find((t) => t.id === tipo)?.kicker ?? "Média";

  return (
    <main>
      <h1>Média de notas</h1>

      <section
        className={`result${media === null ? "" : media >= min ? " is-ok" : " is-bad"}`}
        aria-live="polite"
      >
        <p className="kicker">{kicker}</p>
        {media === null ? (
          <>
            <span className="big ghost" aria-hidden="true">
              0,00
            </span>
            <p className="hint">
              {semMedia
                ? "A média geométrica e a harmônica exigem notas maiores que zero."
                : "Digite ao menos uma nota para ver a média."}
            </p>
          </>
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
          <div className={`head${usaPeso ? "" : " no-peso"}`}>
            <span>Avaliação</span>
            <span>Nota</span>
            {usaPeso && <span>Peso</span>}
            <span />
          </div>
          {avaliacoes.map((a) => {
            const erroId = `erro-${a.id}`;
            const erro = a.erroNota ?? a.erroPeso;
            return (
              <div className={`row${usaPeso ? "" : " no-peso"}`} key={a.id}>
                <input
                  value={a.nome}
                  aria-label="Nome da avaliação"
                  onChange={(e) => update(a.id, "nome", e.target.value)}
                />
                <label className="field">
                  <span className="field-label">Nota</span>
                  <input
                    value={a.nota}
                    inputMode="decimal"
                    placeholder="0–10"
                    className={a.erroNota ? "is-invalid" : undefined}
                    aria-label={`Nota de ${a.nome}`}
                    aria-invalid={a.erroNota !== null || undefined}
                    aria-describedby={erro ? erroId : undefined}
                    onChange={(e) => update(a.id, "nota", e.target.value)}
                  />
                </label>
                {usaPeso && (
                  <label className="field">
                    <span className="field-label">Peso</span>
                    <input
                      value={a.peso}
                      inputMode="decimal"
                      className={a.erroPeso ? "is-invalid" : undefined}
                      aria-label={`Peso de ${a.nome}`}
                      aria-invalid={a.erroPeso !== null || undefined}
                      aria-describedby={erro ? erroId : undefined}
                      onChange={(e) => update(a.id, "peso", e.target.value)}
                    />
                  </label>
                )}
                <button
                  className="del"
                  aria-label={`Remover ${a.nome}`}
                  onClick={() => remove(a.id)}
                >
                  ✕
                </button>
                {erro && (
                  <p className="row-error" id={erroId}>
                    {erro}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <button className="add" onClick={add}>
          Adicionar avaliação
        </button>
      </section>

      <section className="panel opts">
        <div>
          <label htmlFor="tipo">Tipo de média</label>
          <select
            id="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoMedia)}
          >
            {TIPOS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="min">Média mínima</label>
          <input
            id="min"
            value={minima}
            inputMode="decimal"
            className={minErro ? "is-invalid" : undefined}
            aria-invalid={minErro !== null || undefined}
            aria-describedby={minErro ? "min-erro" : undefined}
            onChange={(e) => setMinima(e.target.value)}
          />
          {minErro && (
            <p className="field-error" id="min-erro">
              {minErro}
            </p>
          )}
        </div>
        {usaPeso && (
          <div>
            <label htmlFor="pp">Peso da próxima avaliação</label>
            <input
              id="pp"
              value={pesoProx}
              inputMode="decimal"
              className={qErro ? "is-invalid" : undefined}
              aria-invalid={qErro !== null || undefined}
              aria-describedby={qErro ? "pp-erro" : undefined}
              onChange={(e) => setPesoProx(e.target.value)}
            />
            {qErro && (
              <p className="field-error" id="pp-erro">
                {qErro}
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

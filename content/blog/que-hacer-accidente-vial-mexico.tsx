import type { BlogPost } from "@/lib/blog";
import {
  Callout,
  H2,
  OL,
  P,
  Strong,
} from "@/components/blog/prose";

function Content() {
  return (
    <>
      <P>
        Cada año en México ocurren más de 360 mil accidentes de tránsito. La
        mayoría de las personas no saben qué hacer en los primeros minutos, y
        esos minutos son los que definen si alguien vive, queda con secuelas o
        si tu seguro paga. Esta es la lista corta — la versión sin rodeos.
      </P>

      <H2>1. Detente, respira, evalúa</H2>
      <P>
        Lo primero <Strong>no</Strong> es llamar al 911. Es ponerte a salvo. Si
        puedes mover el vehículo a la acera o al acotamiento, hazlo. Pon las
        intermitentes. Si traes triángulos o conos, colócalos. Si hay humo o
        gasolina, sal del auto inmediatamente. Si te duele algo, no te muevas
        bruscamente; espera ayuda.
      </P>

      <H2>2. Llama al 911 — no a la grúa, no a tu papá, no al seguro</H2>
      <P>
        El 911 cubre todo: ambulancia, tránsito y policía. Tu seguro y tu
        familia van DESPUÉS. Cuando llames, da tres datos:
      </P>
      <OL>
        <li>
          <Strong>Dónde estás:</Strong> nombre de la carretera o avenida + km o
          cruce más cercano. Si no sabes, abre Google Maps y lee las
          coordenadas.
        </li>
        <li>
          <Strong>Qué pasó:</Strong> "choque entre dos autos", "moto contra
          peatón", "volcadura". Sin adornos.
        </li>
        <li>
          <Strong>Cuántos heridos:</Strong> aunque sea "no estoy seguro, hay
          gente atrapada".
        </li>
      </OL>

      <Callout kind="info">
        Si usas <Strong>RescueNow</Strong>, el botón SOS envía tu ubicación al
        911 y a tu contacto de confianza en un solo toque. Si la app detecta el
        impacto sola (más de 4G), el SOS se dispara automáticamente con 10
        segundos para cancelar.
      </Callout>

      <H2>3. NO muevas a los heridos (salvo que haya fuego)</H2>
      <P>
        Esto es contraintuitivo. La gente quiere "ayudar" cargando a los
        accidentados. <Strong>No lo hagas.</Strong> Si tienen lesión de
        columna, los puedes paralizar de por vida. La regla universal: deja a
        los heridos donde están y espera a paramédicos. La única excepción es
        si hay fuego, riesgo de explosión o el vehículo está en una vía con
        tráfico que viene en contra.
      </P>

      <H2>4. Documenta antes que cualquier discusión</H2>
      <P>
        Antes de gritarle al otro conductor, antes de hablar con tu seguro,
        antes de mover nada: <Strong>foto</Strong>. Foto de los dos vehículos
        en su posición exacta. Foto de las placas. Foto de las licencias y
        pólizas. Foto del entorno (señales, semáforo, lluvia). 30 segundos de
        celular te ahorran semanas de proceso.
      </P>

      <H2>5. Reporta a tu seguro DENTRO de las primeras 24 horas</H2>
      <P>
        Muchos seguros mexicanos cancelan la cobertura si pasa demasiado tiempo
        sin reportar. Llama al ajustador en cuanto estés seguro. Si tu auto es
        nuevo y tiene asistencia, también pídela: grúa, peritaje legal y
        traslado del vehículo, sin que tú muevas un dedo.
      </P>

      <Callout kind="warning">
        Si te toca peritar, <Strong>no firmes</Strong> ningún documento sin
        leerlo. Si el otro conductor te presiona o te ofrece dinero "para no
        meter al seguro", pide policía. Lo que parece favor termina costando
        caro.
      </Callout>

      <H2>Bonus: comparte tu ubicación EN VIVO con alguien</H2>
      <P>
        Mientras llega la ayuda, comparte tu ubicación en tiempo real con un
        contacto. WhatsApp, Google Maps o RescueNow lo hacen. Saber que
        alguien sabe dónde estás baja la ansiedad y te permite pensar mejor.
      </P>

      <H2>Resumen para guardar</H2>
      <OL>
        <li>Pon el vehículo a salvo + intermitentes</li>
        <li>911 (no grúa, no familia, no seguro primero)</li>
        <li>No muevas heridos</li>
        <li>Foto, foto, foto antes de hablar</li>
        <li>Seguro en las primeras 24 h</li>
      </OL>

      <P>
        El día que necesites esta lista, no vas a tener tiempo de leerla.
        Guárdala ahora.
      </P>
    </>
  );
}

export const post: BlogPost = {
  slug: "que-hacer-accidente-vial-mexico",
  title: "5 cosas que debes hacer si tienes un accidente vial en México",
  excerpt:
    "La lista que no te enseñó tu autoescuela. Los primeros minutos después de un choque definen todo: salud, dinero y proceso legal.",
  date: "2026-05-12",
  author: "Equipo RescueNow",
  category: "Seguridad vial",
  readMinutes: 5,
  heroEmoji: "🚨",
  heroGradient: "linear-gradient(135deg, #E11D48, #F59E0B)",
  Content,
};

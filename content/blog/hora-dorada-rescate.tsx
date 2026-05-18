import type { BlogPost } from "@/lib/blog";
import { Callout, H2, P, Quote, Strong } from "@/components/blog/prose";

function Content() {
  return (
    <>
      <P>
        En medicina de trauma existe un concepto que cualquier paramédico
        repite como mantra: la <Strong>hora dorada</Strong>. Es la primera hora
        después de una lesión grave. Si el paciente llega a un quirófano
        durante esos 60 minutos, la probabilidad de sobrevivir se dispara. Si
        pasan 90, baja drásticamente. Si pasan dos horas, muchas veces ya es
        tarde.
      </P>

      <Quote>
        "Por cada minuto que pasa sin atención adecuada en un trauma severo, la
        probabilidad de sobrevivir baja entre 1 y 2 por ciento."
      </Quote>

      <H2>De dónde vienen esos minutos perdidos</H2>
      <P>
        La gente cree que el problema es la ambulancia: que tarda. Pero los
        estudios muestran que el cuello de botella casi siempre está antes:
      </P>
      <P>
        <Strong>Minutos 0 a 5:</Strong> nadie sabe que pasó algo. La víctima
        está sola, inconsciente o aturdida. Quizá un transeúnte ya pasó y no
        se dio cuenta.
      </P>
      <P>
        <Strong>Minutos 5 a 15:</Strong> alguien llama al 911 pero no sabe la
        ubicación exacta. "Por la carretera...". El operador pide más detalles.
        La ambulancia sale al rumbo aproximado.
      </P>
      <P>
        <Strong>Minutos 15 a 30:</Strong> la ambulancia busca el sitio exacto.
        En carreteras nocturnas o lluvia, pasan de largo.
      </P>
      <P>
        Esos primeros 30 minutos son el verdadero problema. La velocidad de la
        ambulancia es lo último.
      </P>

      <H2>Cómo se gana tiempo (en orden de impacto)</H2>

      <H2>1. Detección automática</H2>
      <P>
        El acelerómetro de cualquier teléfono detecta impactos superiores a 4G.
        Si una app está vigilando, sabe que pasó algo antes que la propia
        víctima. <Strong>Minuto 0</Strong>: alguien sabe.
      </P>

      <H2>2. Ubicación precisa</H2>
      <P>
        GPS + altimetría + dirección. Coordenadas que el operador del 911 ya
        puede pasar al despacho sin preguntarle a nadie.{" "}
        <Strong>Minuto 1</Strong>: ya hay coordenadas.
      </P>

      <H2>3. Ficha médica accesible</H2>
      <P>
        Tipo de sangre, alergias, condiciones. El paramédico no llega a
        diagnosticar de cero. <Strong>Minuto 15</Strong>: tratamiento dirigido,
        no aproximado.
      </P>

      <H2>4. Contacto de confianza notificado</H2>
      <P>
        Alguien que pueda decidir por la víctima (transfusiones,
        procedimientos) llega al hospital al mismo tiempo o antes que la
        ambulancia. <Strong>Minuto 45</Strong>: decisión rápida en quirófano.
      </P>

      <Callout kind="info">
        Esto es exactamente lo que automatiza <Strong>RescueNow</Strong>. No
        inventa medicina: aplica el flujo que los servicios de emergencia ya
        recomiendan, sin depender de que la víctima esté consciente.
      </Callout>

      <H2>El cálculo crudo</H2>
      <P>
        En México, las llamadas al 911 por accidente vial tardan en promedio 8
        a 12 minutos en ubicar al herido (datos del SUME en zonas urbanas, más
        en carretera). Si una app reduce esto a 1 minuto, son entre 7 y 11
        minutos de hora dorada que ganas. En trauma severo, eso es entre el 7
        y el 22 por ciento más de probabilidad de sobrevivir.
      </P>

      <H2>Lo que NO va a sustituir nunca</H2>
      <P>
        Ni la mejor tecnología cambia que necesitas:
      </P>
      <P>
        Manejar despacio. Usar cinturón. No revisar el celular al volante. Las
        leyes físicas no se programan.
      </P>

      <H2>La regla simple</H2>
      <P>
        El primer minuto vale más que la siguiente hora. Si tu app, tu reloj o
        tu auto pueden empezar la cadena de auxilio en menos de 60 segundos,
        ya ganaste la mitad de la batalla.
      </P>
    </>
  );
}

export const post: BlogPost = {
  slug: "hora-dorada-rescate",
  title: "La regla de oro del rescate: por qué cada segundo cuenta",
  excerpt:
    "En medicina de trauma existe la 'hora dorada'. Te explicamos qué es, dónde se pierden los minutos y cómo la tecnología cambia el juego.",
  date: "2026-05-06",
  author: "Equipo RescueNow",
  category: "Salud",
  readMinutes: 5,
  heroEmoji: "⏱️",
  heroGradient: "linear-gradient(135deg, #F59E0B, #E11D48)",
  Content,
};

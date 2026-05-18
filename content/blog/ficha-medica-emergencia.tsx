import type { BlogPost } from "@/lib/blog";
import {
  Callout,
  H2,
  H3,
  OL,
  P,
  Strong,
  UL,
} from "@/components/blog/prose";

function Content() {
  return (
    <>
      <P>
        Si mañana te atropellan y caes inconsciente, ¿el paramédico que llegue
        sabría tu tipo de sangre? ¿Sabría que eres alérgico a la penicilina?
        Probablemente no. Y ahí pierdes minutos críticos.
      </P>

      <P>
        Una ficha médica de emergencia es información mínima que los
        paramédicos pueden leer sin desbloquear tu teléfono. Toma 5 minutos
        crearla. Te puede salvar.
      </P>

      <H2>Qué debe llevar tu ficha</H2>
      <UL>
        <li>
          <Strong>Tipo de sangre</Strong> y factor Rh (A+, O-, etc.)
        </li>
        <li>
          <Strong>Alergias críticas:</Strong> medicamentos, alimentos, látex
        </li>
        <li>
          <Strong>Condiciones médicas:</Strong> diabetes, epilepsia, marcapasos,
          embarazo
        </li>
        <li>
          <Strong>Medicamentos diarios:</Strong> nombre + dosis
        </li>
        <li>
          <Strong>Contacto de confianza:</Strong> nombre + teléfono (alguien
          que pueda decidir por ti)
        </li>
        <li>
          <Strong>Donador de órganos:</Strong> sí o no
        </li>
      </UL>

      <H2>Cómo crearla en iPhone (gratis, sin apps extra)</H2>
      <OL>
        <li>
          Abre la app <Strong>Salud</Strong>
        </li>
        <li>Toca tu foto arriba a la derecha</li>
        <li>"Cartilla médica" → Editar</li>
        <li>Llena los datos importantes</li>
        <li>
          <Strong>Activa "Mostrar al desbloquear"</Strong>: ahí está la magia.
          Cualquier paramédico puede acceder sin tu código.
        </li>
      </OL>

      <H2>Cómo crearla en Android</H2>
      <P>
        Depende del fabricante, pero la mayoría tiene "ICE" (In Case of
        Emergency):
      </P>
      <UL>
        <li>
          <Strong>Samsung:</Strong> Ajustes → Seguridad y emergencia →
          Información médica
        </li>
        <li>
          <Strong>Google Pixel y otros:</Strong> Ajustes → Seguridad personal →
          Información médica
        </li>
      </UL>

      <Callout kind="info">
        La <Strong>Ficha S.O.S. de RescueNow</Strong> funciona igual pero suma
        dos cosas: la ves desde la pantalla bloqueada sin necesidad de buscar
        en menús (1 toque al botón SOS), y se envía automáticamente al 911 y a
        tu contacto cuando el SOS se dispara. Funciona sin internet.
      </Callout>

      <H2>Errores comunes</H2>

      <H3>No dejar el contacto correcto</H3>
      <P>
        "Mamá" no sirve si tu mamá está en otro estado y no contesta. Pon a
        alguien que viva cerca y conteste rápido. Idealmente alguien que sepa
        de tus condiciones médicas.
      </P>

      <H3>Olvidar actualizar</H3>
      <P>
        Tu ficha de hace 3 años puede tener medicamentos que ya no tomas.
        Revísala cada 6 meses. Pon un recordatorio en el calendario.
      </P>

      <H3>Pensar que "no tengo nada" exime</H3>
      <P>
        Aunque seas sano y joven, los paramédicos NECESITAN saber tu tipo de
        sangre antes de transfundir. Sin ese dato, esperan a un análisis,
        pierden tiempo.
      </P>

      <H2>El detalle que casi nadie pone: idiomas</H2>
      <P>
        Si manejas en zonas turísticas (Cancún, Cabo, CDMX), agrega a tu ficha
        un campo en inglés. Muchos paramédicos privados de zonas turísticas
        hablan inglés y eso facilita la atención de turistas — pero si tú
        viajas a otro país, vas a agradecer haber puesto el tuyo en su idioma.
      </P>

      <Callout kind="success">
        <Strong>Acción ahora:</Strong> abre tu teléfono, busca "información
        médica" y pasa 5 minutos. Es lo más útil que vas a hacer hoy.
      </Callout>
    </>
  );
}

export const post: BlogPost = {
  slug: "ficha-medica-emergencia",
  title: "Cómo crear tu ficha médica de emergencia (con o sin app)",
  excerpt:
    "5 minutos hoy te ahorran un problema enorme mañana. Te enseñamos cómo hacerla en iPhone, Android, y por qué la versión de RescueNow va más allá.",
  date: "2026-05-09",
  author: "Equipo RescueNow",
  category: "Salud",
  readMinutes: 4,
  heroEmoji: "🏥",
  heroGradient: "linear-gradient(135deg, #0EA5E9, #E11D48)",
  Content,
};

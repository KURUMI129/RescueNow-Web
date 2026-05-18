import type { BlogPost } from "@/lib/blog";
import { Callout, H2, OL, P, Strong, UL } from "@/components/blog/prose";

function Content() {
  return (
    <>
      <P>
        Un familiar manejando solo. La llamada que prometió hacer al llegar no
        llega. Pasan 30 minutos. 60. Mandas mensajes, nada. ¿Qué haces?
      </P>

      <P>
        Esta guía es para ese momento. Sin paranoia pero sin perder tiempo.
      </P>

      <H2>Primeros 15 minutos: descarta lo cotidiano</H2>
      <P>
        El 95% de las veces no hay accidente: hay batería muerta, hay
        cobertura, hay un paro que tardó más. Antes de alarmarte:
      </P>
      <UL>
        <li>
          <Strong>Llama 3 veces</Strong> con 2 minutos entre cada una. Si suena
          y entra al buzón, hay teléfono pero no contesta.
        </li>
        <li>
          <Strong>Manda WhatsApp.</Strong> Si llega un check pero no se lee,
          puede ser que esté manejando o sin ver el teléfono.
        </li>
        <li>
          <Strong>Pregunta a alguien que viaje con esa persona</Strong> o vea
          su ubicación. Esposo, hijo, compañero de trabajo.
        </li>
      </UL>

      <H2>Después de 30 minutos sin respuesta: activa</H2>

      <H2>1. Revisa "Encontrar mi teléfono"</H2>
      <P>
        Si alguna vez compartieron ubicación (Google Maps, Find My, Family
        Link), míralo. Si el teléfono está apagado o en movimiento, ya tienes
        datos para decidir.
      </P>

      <H2>2. Llama a la última caseta o punto conocido</H2>
      <P>
        Si sabes la ruta, las casetas de cuota tienen registro de los autos que
        pasan. No te van a dar el dato directo, pero saben si hubo incidentes
        en los últimos 30 minutos. El 088 (Guardia Nacional) también recibe
        reportes de carretera.
      </P>

      <H2>3. Reporta al 911 como "persona no localizada en carretera"</H2>
      <P>
        No tiene que ser "estoy seguro que hubo un accidente". Puedes decir:
        "mi familiar sale en dirección X, no responde desde hace 1 hora,
        quiero saber si hubo algún reporte". El operador puede consultar a las
        bases activas en la zona.
      </P>

      <Callout kind="info">
        Si tu familiar usa <Strong>RescueNow</Strong> y te tiene como contacto
        de confianza, ya recibiste un mensaje automático si hubo impacto
        detectado. Si no recibiste nada, es una buena señal — la app vigila
        aunque tu familiar no toque nada.
      </Callout>

      <H2>4. Pide ayuda a quien esté cerca de la ruta</H2>
      <P>
        Si tienes contactos en la zona (familia, amigos, compañeros),
        pregúntales si pueden ir a ver. Casi siempre el incidente fue menor y
        agradeces que alguien fue rápido.
      </P>

      <H2>Lo que NO funciona</H2>

      <UL>
        <li>
          <Strong>Llamar a los hospitales uno por uno.</Strong> En México la
          mayoría no te da información por teléfono por privacidad. Pierdes
          tiempo.
        </li>
        <li>
          <Strong>Esperar a que aparezca.</Strong> Si pasaron más de 90 minutos
          sin señal alguna, los protocolos institucionales (911, seguros)
          actúan más rápido que tu intuición.
        </li>
        <li>
          <Strong>Manejar tú a buscarlo a la carretera de noche</Strong> sin
          coordinarte con autoridades. Te conviertes en una segunda persona
          potencialmente perdida.
        </li>
      </UL>

      <H2>El protocolo de 90 minutos</H2>
      <OL>
        <li>
          <Strong>0-15 min:</Strong> intentos directos (llamada, WhatsApp)
        </li>
        <li>
          <Strong>15-30 min:</Strong> revisar ubicación + preguntar a cercanos
        </li>
        <li>
          <Strong>30-60 min:</Strong> contactar 088 / 911 + pedir alguien que
          vaya
        </li>
        <li>
          <Strong>60-90 min:</Strong> reporte formal + contactar seguro
        </li>
      </OL>

      <Callout kind="success">
        <Strong>Cómo evitar este momento:</Strong> que tus familiares activen
        "compartir ubicación en tiempo real" o usen una app con detección de
        choques. 30 segundos de configuración hoy te ahorran horas de angustia
        mañana.
      </Callout>

      <H2>La conversación incómoda</H2>
      <P>
        Si tu pareja, papás o hijos no comparten ubicación contigo, ten la
        conversación. No es invasión: es prevención. "Si algo me pasa, ¿cómo te
        enteras?" suele ser suficiente para que entiendan el por qué.
      </P>

      <P>
        El día que más necesitas saber dónde está alguien que amas, no quieres
        depender de que ese alguien tenga batería, señal y conciencia.
      </P>
    </>
  );
}

export const post: BlogPost = {
  slug: "familiar-no-contesta-accidente",
  title: "¿Qué hacer si un familiar está en un accidente y no contesta?",
  excerpt:
    "El protocolo de 90 minutos para la incertidumbre. Qué hacer, qué no, y cómo evitar este momento desde antes.",
  date: "2026-04-28",
  author: "Equipo RescueNow",
  category: "Familia",
  readMinutes: 5,
  heroEmoji: "📞",
  heroGradient: "linear-gradient(135deg, #7C2D12, #F59E0B)",
  Content,
};

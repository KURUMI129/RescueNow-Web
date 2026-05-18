import type { BlogPost } from "@/lib/blog";
import { Callout, H2, OL, P, Strong, UL } from "@/components/blog/prose";

function Content() {
  return (
    <>
      <P>
        Quedarte varado de noche en carretera con el teléfono muerto es una de
        esas pesadillas que parecen lejanas hasta que pasan. Y cuando pasan,
        las decisiones de los primeros 30 minutos son las que cuentan.
      </P>

      <H2>Antes de salir: la lista de 90 segundos</H2>
      <P>
        Si vas a manejar más de 50 km, tarda minuto y medio en chequear:
      </P>
      <UL>
        <li>
          <Strong>Llanta de refacción</Strong> con aire y herramienta (gato +
          llave)
        </li>
        <li>
          <Strong>Power bank</Strong> con al menos 50% de carga
        </li>
        <li>
          <Strong>Tanque arriba de la mitad</Strong> si vas a tramo
          desconocido
        </li>
        <li>
          <Strong>Agua</Strong> (1 L mínimo por persona)
        </li>
        <li>
          <Strong>Linterna</Strong> (la del celular cuenta solo si tienes
          batería)
        </li>
        <li>
          <Strong>Tarjeta del seguro</Strong> física, no solo en el celular
        </li>
      </UL>

      <Callout kind="info">
        Si usas RescueNow, comparte tu ruta antes de salir con tu contacto de
        confianza. Si dejas de moverte sin avisar, le llega un aviso. Funciona
        incluso si tu teléfono se queda sin batería a medio camino — el último
        ping queda registrado.
      </Callout>

      <H2>Ya varado: la prioridad es ser visto</H2>

      <H2>1. Saca el auto del carril</H2>
      <P>
        Aunque sea raspando la llanta contra la cuneta. Un auto detenido en el
        carril a las 11 de la noche es un riesgo enorme. El acotamiento siempre
        es mejor.
      </P>

      <H2>2. Intermitentes + triángulo</H2>
      <P>
        Las intermitentes dan visibilidad inmediata pero gastan batería del
        auto. Si crees que vas a tardar más de 30 minutos, apágalas y deja solo
        el triángulo o conos a 50 metros atrás del vehículo.
      </P>

      <H2>3. Sal del auto SOLO si el lugar es seguro</H2>
      <P>
        Si estás en autopista de alta velocidad, lo más seguro suele ser
        QUEDARTE adentro con cinturón puesto. En tramo rural sin tránsito,
        afuera con la espalda contra el guardarriel está bien. Lee el contexto.
      </P>

      <H2>Sin señal: cómo pides ayuda</H2>

      <H2>Mensaje SOS por satélite (iPhone 14+, Pixel 9+)</H2>
      <P>
        Los modelos recientes pueden enviar SMS al 911 vía satélite sin antena
        celular. Búscalo en "Emergencia SOS por satélite". Toma unos minutos
        apuntar al cielo pero funciona.
      </P>

      <H2>Caminar al punto más alto</H2>
      <P>
        Subir 50-100 metros de altura suele recuperar señal. No te alejes más
        de lo necesario y nunca camines de noche en autopista sin chaleco
        reflejante.
      </P>

      <H2>Hacer "stop" con código</H2>
      <P>
        El protocolo internacional para pedir ayuda con una linterna es{" "}
        <Strong>3 destellos cortos, pausa, 3 destellos cortos</Strong>.
        Cualquier camionero o conductor experimentado lo reconoce.
      </P>

      <H2>Sin batería: planea la siguiente decisión</H2>
      <P>
        Si tu celular ya murió, tu única opción es pedir ayuda al primer auto
        que pase O caminar a un punto con luz. Calcula:
      </P>
      <OL>
        <li>¿Cuándo va a salir alguien a buscarme si no llego?</li>
        <li>¿Hay caseta o gasolinera en menos de 5 km?</li>
        <li>¿Mejor caminar de día o esperar a alguien de noche?</li>
      </OL>

      <Callout kind="warning">
        <Strong>Regla general:</Strong> no camines de noche en carretera. La
        mortalidad de peatones nocturnos es 5 veces más alta que diurnos. Si
        vas a esperar, hazlo afuera del vehículo, atrás del guardarriel, con
        ropa visible.
      </Callout>

      <H2>El kit que pesa 800 gramos y te salva la vida</H2>
      <UL>
        <li>Power bank 10,000 mAh</li>
        <li>Cable USB-C/Lightning</li>
        <li>Linterna LED + 4 pilas AA</li>
        <li>Triángulo plegable + 2 chalecos reflejantes</li>
        <li>Botella de agua 1 L</li>
        <li>Granola/barras (5 piezas)</li>
        <li>Hojas + pluma (para dejar mensaje)</li>
      </UL>
      <P>
        Cabe en una bolsa pequeña en la cajuela. Lo armas una vez y se queda.
      </P>

      <H2>Resumen</H2>
      <P>
        El plan: revisar antes, ser visto, no caminar de noche, usar satélite
        si tienes equipo nuevo, y tener un kit. No se trata de paranoia, se
        trata de no depender de la suerte.
      </P>
    </>
  );
}

export const post: BlogPost = {
  slug: "sin-bateria-varado-carretera",
  title: "Sin batería, sin señal: cómo sobrevivir varado en carretera",
  excerpt:
    "Qué hacer cuando estás solo, lejos y tu teléfono se murió. Una guía práctica para los 30 minutos críticos.",
  date: "2026-05-02",
  author: "Equipo RescueNow",
  category: "Seguridad vial",
  readMinutes: 6,
  heroEmoji: "🔋",
  heroGradient: "linear-gradient(135deg, #1E1B4B, #E11D48)",
  Content,
};

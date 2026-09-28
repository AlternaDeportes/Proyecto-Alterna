import {
  Dificultad,
  ModeracionEstado,
  PrismaClient,
  RolNombre,
} from "@prisma/client";
import { cuerpoHistoriaPorSlug } from "../modules/historias/data/historias-fallback";
import { designTokens } from "../config/design-tokens";
import {
  MAP_CIUDADES,
  OTROS_SPORT_COLOR,
  OTROS_SPORT_SLUG,
} from "../config/map-region";
import { UBICACIONES_CATALOGO } from "../modules/mapa/data/ubicaciones-catalogo";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed ALTERNA — iniciando…");

  const roles = await Promise.all(
    (["USER", "MODERATOR", "ADMIN"] as RolNombre[]).map((nombre) =>
      prisma.rol.upsert({
        where: { nombre },
        update: {},
        create: { nombre },
      })
    )
  );
  console.log(`   ✓ ${roles.length} roles`);

  const ciudades = [];
  for (const c of MAP_CIUDADES) {
    const ciudad = await prisma.ciudad.upsert({
      where: { slug: c.slug },
      update: { nombre: c.nombre, region: c.region, lat: c.lat, lng: c.lng },
      create: {
        nombre: c.nombre,
        region: c.region,
        pais: "Argentina",
        slug: c.slug,
        lat: c.lat,
        lng: c.lng,
      },
    });
    ciudades.push(ciudad);
  }
  const ciudadSantaFe = ciudades.find((c) => c.slug === "santa-fe")!;
  console.log(`   ✓ ${ciudades.length} ciudades (región)`);

  const categoria = await prisma.categoria.upsert({
    where: { slug: "alternativos" },
    update: {},
    create: { nombre: "Deportes alternativos", slug: "alternativos" },
  });

  const deportesData = [
    {
      slug: "ultimate-frisbee",
      nombre: "Ultimate Frisbee",
      descripcion:
        "Sin árbitro, en equipo y con disco. En Santa Fe hay canchas abiertas: vení a ver o sumate.",
      historia:
        "En Santa Fe el Ultimate crece porque alguien te dice vení. Acá ves quiénes juegan y dónde encontrarlos: el paso siguiente es ir.",
      dificultad: Dificultad.INTERMEDIO,
      jugadoresMin: 7,
      jugadoresMax: 14,
      equipamiento: "Disco, cancha amplia, calzado deportivo",
      colorPrimario: designTokens.sports.ultimate,
      destacado: true,
    },
    {
      slug: "newcom",
      nombre: "Newcom",
      descripcion:
        "Se agarra, se lanza y se juega en club. Buscá tu equipo en el mapa y preguntá cómo entrar.",
      historia:
        "En los clubes santafesinos el Newcom junta generaciones. Si querés entrar, el puente es la gente que ya está ahí: elegí un punto y acercate.",
      dificultad: Dificultad.PRINCIPIANTE,
      jugadoresMin: 6,
      jugadoresMax: 12,
      equipamiento: "Red baja, pelota, espacio cubierto",
      colorPrimario: designTokens.sports.newcom,
      destacado: true,
    },
    {
      slug: "wingfoil",
      nombre: "Wingfoil",
      descripcion:
        "Tabla, ala y el viento del río. El mapa te muestra por dónde arrancar y con quién.",
      historia:
        "Sobre el Paraná y la laguna, el wingfoil se aprende de a poco y en grupo. Si el viento te llama, el mapa te deja en la costa.",
      dificultad: Dificultad.AVANZADO,
      jugadoresMin: 1,
      jugadoresMax: 1,
      equipamiento: "Tabla, ala, arnés, traje según temporada",
      colorPrimario: designTokens.sports.wingfoil,
      destacado: true,
    },
  ] as const;

  const deportes = [];
  for (const d of deportesData) {
    const deporte = await prisma.deporte.upsert({
      where: { slug: d.slug },
      update: {
        nombre: d.nombre,
        descripcion: d.descripcion,
        historia: d.historia,
        seoDescription: d.descripcion,
        colorPrimario: d.colorPrimario,
      },
      create: {
        ...d,
        ciudadId: ciudadSantaFe.id,
        categoriaId: categoria.id,
        publishedAt: new Date(),
        seoTitle: `${d.nombre} en Santa Fe | ALTERNA`,
        seoDescription: d.descripcion,
      },
    });
    deportes.push(deporte);
  }

  const deporteOtros = await prisma.deporte.upsert({
    where: { slug: OTROS_SPORT_SLUG },
    update: {
      nombre: "Otros deportes",
      descripcion:
        "Solo para puntos del mapa: prácticas fuera de Ultimate, Newcom y Wingfoil.",
      colorPrimario: OTROS_SPORT_COLOR,
      destacado: false,
      // Sin ficha editorial (/deportes/otros); solo categoría de mapa.
      publishedAt: null,
    },
    create: {
      slug: OTROS_SPORT_SLUG,
      nombre: "Otros deportes",
      descripcion:
        "Solo para puntos del mapa: prácticas fuera de Ultimate, Newcom y Wingfoil.",
      historia: null,
      dificultad: Dificultad.PRINCIPIANTE,
      colorPrimario: OTROS_SPORT_COLOR,
      destacado: false,
      ciudadId: ciudadSantaFe.id,
      categoriaId: categoria.id,
      publishedAt: null,
      seoTitle: null,
      seoDescription: null,
    },
  });
  deportes.push(deporteOtros);
  console.log(`   ✓ ${deportes.length} deportes (otros = solo mapa)`);

  const ubicacionesData = UBICACIONES_CATALOGO;

  await prisma.ubicacion.updateMany({
    where: { creadoPorId: null, deletedAt: null },
    data: { deletedAt: new Date() },
  });

  for (const u of ubicacionesData) {
    const deporte = deportes.find((d) => d.slug === u.deporteSlug);
    const ciudadUbi = ciudades.find((c) => c.slug === u.ciudadSlug);
    if (!deporte || !ciudadUbi) continue;

    const existente = await prisma.ubicacion.findFirst({
      where: {
        nombre: u.nombre,
        direccion: u.direccion,
        deporteId: deporte.id,
      },
    });

    if (!existente) {
      await prisma.ubicacion.create({
        data: {
          nombre: u.nombre,
          direccion: u.direccion,
          lat: u.lat,
          lng: u.lng,
          horarios: u.horarios,
          contacto: u.contacto,
          historia: u.historia,
          deporteOtroNombre: u.deporteOtroNombre,
          moderacion: ModeracionEstado.APROBADO,
          deporteId: deporte.id,
          ciudadId: ciudadUbi.id,
        },
      });
    } else {
      await prisma.ubicacion.update({
        where: { id: existente.id },
        data: {
          direccion: u.direccion,
          ciudadId: ciudadUbi.id,
          deporteOtroNombre: u.deporteOtroNombre,
          lat: u.lat,
          lng: u.lng,
          horarios: u.horarios,
          contacto: u.contacto,
          historia: u.historia,
          deletedAt: null,
          moderacion: ModeracionEstado.APROBADO,
        },
      });
    }
  }
  console.log(`   ✓ ${ubicacionesData.length} ubicaciones (mapa)`);

  const historiasData = [
    {
      slug: "luchi-farias",
      titulo: "Lucila «Luchi» Farías",
      pullQuote: "El Ultimate me enseñó que el equipo es más grande que el resultado.",
      deporteSlug: "ultimate-frisbee",
    },
    {
      slug: "ciclo-dussex",
      titulo: "Adriel «Ciclo» Dussex",
      pullQuote: "Entrenar es armar un espacio donde cualquiera puede sumarse.",
      deporteSlug: "ultimate-frisbee",
    },
    {
      slug: "monica-lovecchio",
      titulo: "Mónica Lovecchio",
      pullQuote: "En Newcom encontré una familia que no sabía que necesitaba.",
      deporteSlug: "newcom",
    },
    {
      slug: "lucio-cinaglia",
      titulo: "Lucio Cinaglia",
      pullQuote: "El río no es un escenario: es parte del juego.",
      deporteSlug: "wingfoil",
    },
  ] as const;

  for (const h of historiasData) {
    const deporte = deportes.find((d) => d.slug === h.deporteSlug);
    if (!deporte) continue;

    const cuerpo =
      cuerpoHistoriaPorSlug(h.slug) ??
      "Historia en producción documental. Próximamente el relato completo en ALTERNA.";

    await prisma.historia.upsert({
      where: { slug: h.slug },
      update: {
        titulo: h.titulo,
        pullQuote: h.pullQuote,
        cuerpo,
      },
      create: {
        slug: h.slug,
        titulo: h.titulo,
        cuerpo,
        pullQuote: h.pullQuote,
        destacada: true,
        deporteId: deporte.id,
        publishedAt: new Date(),
      },
    });
  }
  console.log(`   ✓ ${historiasData.length} historias destacadas`);

  const podcast = await prisma.podcast.upsert({
    where: { slug: "alterna-podcast" },
    update: {
      titulo: "ALTERNA Podcast",
      descripcion:
        "Charlas con quienes juegan y entrenan ultimate, newcom y wingfoil en Santa Fe. Escuchá Alternando voces en Spotify.",
      publishedAt: new Date(),
    },
    create: {
      slug: "alterna-podcast",
      titulo: "ALTERNA Podcast",
      descripcion:
        "Charlas con quienes juegan y entrenan ultimate, newcom y wingfoil en Santa Fe. Escuchá Alternando voces en Spotify.",
      publishedAt: new Date(),
    },
  });

  const episodiosPod = [
    {
      slug: "entrenar-en-comunidad",
      titulo: "Entrenar en comunidad",
      descripcion:
        "Conversación sobre autogestión, constancia y pertenencia local. Cómo se arma un entrenamiento abierto cuando no hay club grande detrás.",
      numero: 1,
      duracionSeg: 28 * 60,
      deporteSlug: "ultimate-frisbee",
    },
    {
      slug: "jugar-fuera-del-foco",
      titulo: "Jugar fuera del foco",
      descripcion:
        "Historias de quienes sostienen deportes invisibilizados: Newcom, redes barriales y el valor de volver cada semana.",
      numero: 2,
      duracionSeg: 32 * 60,
      deporteSlug: "newcom",
    },
    {
      slug: "viento-y-rio",
      titulo: "Viento y río",
      descripcion:
        "Wingfoil, lectura del entorno y aprendizaje progresivo junto al Paraná. El río no es un escenario: es parte del juego.",
      numero: 3,
      duracionSeg: 26 * 60,
      deporteSlug: "wingfoil",
    },
  ] as const;

  for (const ep of episodiosPod) {
    const deporte = deportes.find((d) => d.slug === ep.deporteSlug);
    const episodio = await prisma.podcastEpisodio.upsert({
      where: { slug: ep.slug },
      update: {
        titulo: ep.titulo,
        descripcion: ep.descripcion,
        numero: ep.numero,
        duracionSeg: ep.duracionSeg,
        podcastId: podcast.id,
      },
      create: {
        slug: ep.slug,
        titulo: ep.titulo,
        descripcion: ep.descripcion,
        numero: ep.numero,
        duracionSeg: ep.duracionSeg,
        podcastId: podcast.id,
      },
    });

    if (deporte) {
      await prisma.podcastEpisodioDeporte.upsert({
        where: {
          episodioId_deporteId: {
            episodioId: episodio.id,
            deporteId: deporte.id,
          },
        },
        update: {},
        create: {
          episodioId: episodio.id,
          deporteId: deporte.id,
        },
      });
    }
  }
  console.log(`   ✓ podcast + ${episodiosPod.length} episodios`);

  const documental = await prisma.documental.upsert({
    where: { slug: "alterna-documental" },
    update: {
      titulo: "ALTERNA — Deportes por descubrir",
      sinopsis:
        "Serie documental sobre deportes alternativos en Santa Fe. Mirá el teaser y después encontrá a esa gente en el mapa.",
      coverUrl: "/media/documentales/teaser-cover.webp",
      publishedAt: new Date(),
    },
    create: {
      slug: "alterna-documental",
      titulo: "ALTERNA — Deportes por descubrir",
      sinopsis:
        "Serie documental sobre deportes alternativos en Santa Fe. Mirá el teaser y después encontrá a esa gente en el mapa.",
      coverUrl: "/media/documentales/teaser-cover.webp",
      publishedAt: new Date(),
    },
  });

  const episodiosDoc = [
    {
      slug: "trailer",
      titulo: "Teaser",
      sinopsis: "Primer vistazo al documental ALTERNA. Ya disponible en YouTube.",
      numero: 0,
      duracionSeg: 90,
      videoUrl: "https://youtu.be/EVA-VO6IL14",
      publishedAt: new Date("2026-09-16T00:00:00-03:00"),
    },
    {
      slug: "episodio-01-ultimate",
      titulo: "Ultimate Frisbee",
      sinopsis:
        "Comunidad, entrenamiento y espíritu deportivo sin árbitros. Voces del Parque Federal y más allá.",
      numero: 1,
      duracionSeg: 18 * 60,
    },
    {
      slug: "episodio-02-newcom-wingfoil",
      titulo: "Newcom y Wingfoil",
      sinopsis:
        "Diversidad de prácticas y apropiación del territorio santafesino: clubes, costa y río.",
      numero: 2,
      duracionSeg: 22 * 60,
    },
  ] as const;

  for (const ep of episodiosDoc) {
    const videoUrl = "videoUrl" in ep ? ep.videoUrl : undefined;
    const publishedAt = "publishedAt" in ep ? ep.publishedAt : undefined;
    await prisma.documentalEpisodio.upsert({
      where: { slug: ep.slug },
      update: {
        titulo: ep.titulo,
        sinopsis: ep.sinopsis,
        numero: ep.numero,
        duracionSeg: ep.duracionSeg,
        documentalId: documental.id,
        ...(videoUrl ? { videoUrl, publishedAt } : {}),
      },
      create: {
        slug: ep.slug,
        titulo: ep.titulo,
        sinopsis: ep.sinopsis,
        numero: ep.numero,
        duracionSeg: ep.duracionSeg,
        documentalId: documental.id,
        videoUrl,
        publishedAt,
      },
    });
  }
  console.log(`   ✓ documental + ${episodiosDoc.length} capítulos`);

  console.log("✅ Seed completado.");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

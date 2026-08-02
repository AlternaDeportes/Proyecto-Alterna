import {
  Dificultad,
  ModeracionEstado,
  PrismaClient,
  RolNombre,
} from "@prisma/client";
import { cuerpoHistoriaPorSlug } from "../modules/historias/data/historias-fallback";
import { designTokens } from "../config/design-tokens";

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

  const ciudad = await prisma.ciudad.upsert({
    where: { slug: "santa-fe" },
    update: {},
    create: {
      nombre: "Santa Fe",
      region: "Santa Fe",
      pais: "Argentina",
      slug: "santa-fe",
      lat: -31.6333,
      lng: -60.7,
    },
  });

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
        "Fútbol con disco: corre, saltá y pasá en equipo. Sin árbitros — el fair play lo arman los jugadores.",
      historia:
        "En Santa Fe, los grupos de Ultimate crecen por recomendación entre amigos, plazas y parques.",
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
        "Vóley adaptado con red baja y reglas propias. Comunidad fuerte, partidos intensos y mucha autogestión.",
      historia:
        "Muy arraigado en clubes santafesinos con participación intergeneracional.",
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
        "Tabla + ala sobre el agua. Libertad, viento y aprendizaje progresivo junto al río y la laguna.",
      historia:
        "Práctica en crecimiento sobre el Paraná y lagunas de la región.",
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
        colorPrimario: d.colorPrimario,
      },
      create: {
        ...d,
        ciudadId: ciudad.id,
        categoriaId: categoria.id,
        publishedAt: new Date(),
        seoTitle: `${d.nombre} en Santa Fe | ALTERNA`,
        seoDescription: d.descripcion,
      },
    });
    deportes.push(deporte);
  }
  console.log(`   ✓ ${deportes.length} deportes`);

  const ubicacionesData = [
    {
      slugKey: "parque-federal-ultimate",
      nombre: "Parque Federal",
      direccion: "Salvador del Carril 2200",
      lat: -31.6176,
      lng: -60.6992,
      horarios: "Lun y jue 20:00",
      contacto: "@ultimate.sf",
      historia: "Entrenan con foco en juego limpio y mixto.",
      deporteSlug: "ultimate-frisbee",
    },
    {
      slugKey: "regatas-newcom",
      nombre: "Club Regatas Santa Fe",
      direccion: "Av. Alem 3288",
      lat: -31.6406,
      lng: -60.7001,
      horarios: "Mar y vie 18:30",
      contacto: "@newcom.sf",
      historia: "Grupo abierto con fuerte espíritu comunitario.",
      deporteSlug: "newcom",
    },
    {
      slugKey: "laguna-setubal-wingfoil",
      nombre: "Laguna Setúbal",
      direccion: "Costanera Este",
      lat: -31.6253,
      lng: -60.6618,
      horarios: "Sáb y dom 10:00",
      contacto: "wingfoil.sf@gmail.com",
      historia: "Iniciación progresiva en aguas de la región.",
      deporteSlug: "wingfoil",
    },
    {
      slugKey: "parque-garay-ultimate",
      nombre: "Parque Garay",
      direccion: "Av. Perón 3600",
      lat: -31.6547,
      lng: -60.7118,
      horarios: "Mié 19:00",
      contacto: "@ultimate.garay",
      historia: "Entrenamientos recreativos para sumarse desde cero.",
      deporteSlug: "ultimate-frisbee",
    },
    {
      slugKey: "zuviría-newcom",
      nombre: "C.I.C. Facundo Zuviría",
      direccion: "Facundo Zuviría 8000",
      lat: -31.5848,
      lng: -60.6904,
      horarios: "Lun, mié y vie 17:00",
      contacto: "@newcom.zuviria",
      historia: "Participación intergeneracional y torneos barriales.",
      deporteSlug: "newcom",
    },
  ] as const;

  for (const u of ubicacionesData) {
    const deporte = deportes.find((d) => d.slug === u.deporteSlug);
    if (!deporte) continue;

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
          moderacion: ModeracionEstado.APROBADO,
          deporteId: deporte.id,
          ciudadId: ciudad.id,
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
        "Charlas con entrenadores, jugadoras y referentes para ampliar la historia más allá de la imagen. Voces en primera persona desde Santa Fe.",
      publishedAt: new Date(),
    },
    create: {
      slug: "alterna-podcast",
      titulo: "ALTERNA Podcast",
      descripcion:
        "Charlas con entrenadores, jugadoras y referentes para ampliar la historia más allá de la imagen. Voces en primera persona desde Santa Fe.",
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
        "Serie documental sobre deportes alternativos y amateurs en Santa Fe. Trailer y episodios para profundizar en las historias humanas detrás de cada disciplina.",
      publishedAt: new Date(),
    },
    create: {
      slug: "alterna-documental",
      titulo: "ALTERNA — Deportes por descubrir",
      sinopsis:
        "Serie documental sobre deportes alternativos y amateurs en Santa Fe. Trailer y episodios para profundizar en las historias humanas detrás de cada disciplina.",
      publishedAt: new Date(),
    },
  });

  const episodiosDoc = [
    {
      slug: "trailer",
      titulo: "Primer vistazo",
      sinopsis: "Presentación del universo narrativo de ALTERNA. Empezá por acá.",
      numero: 0,
      duracionSeg: 90,
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
    await prisma.documentalEpisodio.upsert({
      where: { slug: ep.slug },
      update: {
        titulo: ep.titulo,
        sinopsis: ep.sinopsis,
        numero: ep.numero,
        duracionSeg: ep.duracionSeg,
        documentalId: documental.id,
      },
      create: {
        slug: ep.slug,
        titulo: ep.titulo,
        sinopsis: ep.sinopsis,
        numero: ep.numero,
        duracionSeg: ep.duracionSeg,
        documentalId: documental.id,
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

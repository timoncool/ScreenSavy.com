import type { Language } from "@/components/screensavy/translations";

export type VisualizerCategory = "audio" | "ambient";

export type VisualizerActionType = "microphone" | "systemAudio" | "ambient";

export type VisualizerOverlay = {
  description: Record<Language, string>;
  highlights?: Record<Language, string[]>;
  steps?: Array<{
    title: Record<Language, string>;
    body: Record<Language, string>;
  }>;
  actions: Array<{
    type: VisualizerActionType;
    helper?: Record<Language, string>;
  }>;
  notes?: Record<Language, string[]>;
};

export type VisualizerDefinition = {
  slug: string;
  displayName: Record<Language, string>;
  category: VisualizerCategory;
  iframeSrc: string;
  summary: Record<Language, string>;
  overlay: VisualizerOverlay;
};

export const visualizers: VisualizerDefinition[] = [
  {
    slug: "celestial-weaver",
    displayName: {
      en: "Celestial Weaver",
      ru: "Celestial Weaver",
    },
    category: "audio",
    iframeSrc: "/visualizers/CELESTIAL.html",
    summary: {
      en: "A cosmic loom that threads ribbons of light with your beats.",
      ru: "Космический ткач переплетает световые ленты в такт музыке.",
    },
    overlay: {
      description: {
        en: "The Weaver bends with bass impact while a particle tapestry shimmers from mids and overall energy.",
        ru: "Лента-ткач реагирует на бас, а частицы гобелена мерцают от средних частот и общей громкости.",
      },
      highlights: {
        en: [
          "Light ribbon ('the Weaver') accelerates with every bass hit.",
          "Volumetric particle fabric swells with mids and dynamics.",
          "Bloom and chromatic aberration flare with louder passages.",
        ],
        ru: [
          "Световая лента («ткач») ускоряется на каждом басовом акценте.",
          "Объёмное поле частиц раскрывается от средних частот и динамики.",
          "Свечение и хроматическая аберрация усиливаются на громких участках.",
        ],
      },
      steps: [
        {
          title: {
            en: "Microphone setup",
            ru: "Запуск через микрофон",
          },
          body: {
            en: "Press “Start with microphone”, allow access, choose your input, then confirm to launch the scene.",
            ru: "Нажмите «Запустить с микрофоном», разрешите доступ, выберите устройство и подтвердите запуск сцены.",
          },
        },
        {
          title: {
            en: "Share system audio",
            ru: "Поделиться системным звуком",
          },
          body: {
            en: "Use this for music from a tab or app—tick “Share audio” in the capture dialog before confirming.",
            ru: "Используйте для музыки из вкладки или приложения — поставьте галочку «Поделиться звуком» перед подтверждением.",
          },
        },
      ],
      actions: [
        {
          type: "microphone",
          helper: {
            en: "The browser will ask for microphone access so you can pick the source you prefer.",
            ru: "Браузер запросит доступ к микрофону, после чего можно выбрать нужное устройство.",
          },
        },
        {
          type: "systemAudio",
          helper: {
            en: "Enable the “Share audio” checkbox when choosing a tab or window.",
            ru: "При выборе вкладки или окна обязательно включите опцию «Поделиться звуком».",
          },
        },
      ],
      notes: {
        en: [
          "Tap the gear icon inside the scene to adjust bloom, aberration and particle density.",
          "Bass-forward tracks deliver the most dramatic weaving patterns.",
        ],
        ru: [
          "Кнопка-шестерёнка внутри сцены открывает настройки свечения, аберрации и плотности частиц.",
          "Басовые треки дают самые выразительные узоры.",
        ],
      },
    },
  },
  {
    slug: "super-nova",
    displayName: {
      en: "Super Nova",
      ru: "Super Nova",
    },
    category: "audio",
    iframeSrc: "/visualizers/SUPER_NOVA.html",
    summary: {
      en: "Explosive stellar pulses that orbit and surge with your soundtrack.",
      ru: "Взрывные звёздные импульсы, вращающиеся и пульсирующие вместе с музыкой.",
    },
    overlay: {
      description: {
        en: "A central core, rotating rings and particle spray all react to different parts of the spectrum.",
        ru: "Центральное ядро, вращающиеся кольца и поток частиц реагируют на разные диапазоны частот.",
      },
      highlights: {
        en: [
          "Bass drives the stellar core to pulse and flare.",
          "Rings twist faster when mids and highs spike.",
          "Particle fields thicken with overall loudness.",
        ],
        ru: [
          "Бас заставляет ядро пульсировать и вспыхивать.",
          "Кольца ускоряются при всплесках средних и высоких частот.",
          "Поле частиц становится плотнее с ростом громкости.",
        ],
      },
      steps: [
        {
          title: {
            en: "Microphone setup",
            ru: "Запуск через микрофон",
          },
          body: {
            en: "Choose “Start with microphone”, allow access, then pick and confirm the input device from the list.",
            ru: "Нажмите «Запустить с микрофоном», разрешите доступ и выберите устройство из списка.",
          },
        },
        {
          title: {
            en: "Share system audio",
            ru: "Поделиться системным звуком",
          },
          body: {
            en: "Perfect for YouTube or players—check “Share system audio” (or tab audio) before you confirm capture.",
            ru: "Подходит для YouTube и плееров — поставьте галочку «Поделиться звуком системы/вкладки» перед подтверждением.",
          },
        },
      ],
      actions: [
        {
          type: "microphone",
          helper: {
            en: "Grant microphone permission once, then select the exact input you want to drive the scene.",
            ru: "После разрешения доступа выберите конкретный микрофон, который будет управлять сценой.",
          },
        },
        {
          type: "systemAudio",
          helper: {
            en: "System audio capture works best for streaming sources and desktop players.",
            ru: "Захват системного звука особенно удобен для стримингов и настольных плееров.",
          },
        },
      ],
      notes: {
        en: [
          "The cursor hides after launch—move the mouse to bring it back if you need the controls again.",
          "Bloom and chromatic tweaks are available once the scene is running.",
        ],
        ru: [
          "После запуска курсор скрывается — подвигайте мышью, чтобы вернуть управление.",
          "Настройки свечения и аберрации доступны во время работы сцены.",
        ],
      },
    },
  },
  {
    slug: "retrowave-voyager",
    displayName: {
      en: "Retrowave Voyager",
      ru: "Retrowave Voyager",
    },
    category: "audio",
    iframeSrc: "/visualizers/VOYAGER.html",
    summary: {
      en: "Neon highways, synth suns and procedural palms racing with every bass drop.",
      ru: "Неоновые трассы, синт-солнце и процедурные пальмы ускоряются вместе с басом.",
    },
    overlay: {
      description: {
        en: "Stereo analysers steer traffic lanes, boost speed and ignite the skyline in sync with your mix.",
        ru: "Стерео-анализ управляет полосами движения, ускоряет машину и подсвечивает горизонт в ритме трека.",
      },
      highlights: {
        en: [
          "Lane changes react to sustained bass energy.",
          "Blooming sun and road grid pulse from mids and highs.",
          "Procedural scenery keeps the city flowing endlessly.",
        ],
        ru: [
          "Смена полос реагирует на длительный бас.",
          "Солнце и дорожная сетка пульсируют от средних и высоких частот.",
          "Процедурные декорации создают бесконечный ретро-пейзаж.",
        ],
      },
      steps: [
        {
          title: {
            en: "Microphone setup",
            ru: "Запуск через микрофон",
          },
          body: {
            en: "Hit “Start with microphone”, approve access, choose the input channel and confirm to rev the engine.",
            ru: "Нажмите «Запустить с микрофоном», разрешите доступ, выберите устройство и подтвердите, чтобы трек завёл сцену.",
          },
        },
        {
          title: {
            en: "Share system audio",
            ru: "Поделиться системным звуком",
          },
          body: {
            en: "For synthwave playlists or DJ mixes, share the tab/window audio and keep the checkbox enabled.",
            ru: "Для плейлистов или DJ-сетов поделитесь звуком вкладки/окна и не забудьте включить галочку аудио.",
          },
        },
      ],
      actions: [
        {
          type: "microphone",
          helper: {
            en: "Pick a balanced input—excessive gain can keep the car in boost mode.",
            ru: "Выберите сбалансированный уровень — слишком громкий сигнал удержит машину в режиме форсажа.",
          },
        },
        {
          type: "systemAudio",
          helper: {
            en: "Ideal for stereo sources so both channels feed the lane analysers.",
            ru: "Оптимально для стерео-источников, чтобы оба канала управляли полосами.",
          },
        },
      ],
      notes: {
        en: [
          "dat.GUI controls inside the scene unlock extra tuning for speed, bloom and boosts.",
          "Move the mouse to reveal the interface if it hides during playback.",
        ],
        ru: [
          "Панель dat.GUI внутри сцены позволяет тонко настраивать скорость, свечение и форсаж.",
          "Подвигайте мышью, если интерфейс спрятался во время воспроизведения.",
        ],
      },
    },
  },
  {
    slug: "rgb-lava-lamp",
    displayName: {
      en: "RGB Lava Lamp",
      ru: "RGB Lava Lamp",
    },
    category: "ambient",
    iframeSrc: "/visualizers/Final_RGB_lava.html",
    summary: {
      en: "Sculpted RGB blobs drift and blend into a glassy lava flow.",
      ru: "Скульптурные RGB-пузыри медленно перетекают в стеклянную лаву.",
    },
    overlay: {
      description: {
        en: "A soft-focus ambient scene with constantly morphing color gradients and soothing motion.",
        ru: "Мягкая атмосферная сцена с постоянно меняющимися градиентами и плавным движением.",
      },
      highlights: {
        en: [
          "Layered RGB blobs blur into liquid color.",
          "Slow choreography designed for long-running ambience.",
          "High-resolution canvas fills any display edge to edge.",
        ],
        ru: [
          "Слои RGB-пузырей растворяются в жидком цвете.",
          "Медленная хореография, подходящая для долгого фона.",
          "Высокое разрешение заполняет экран от края до края.",
        ],
      },
      actions: [
        {
          type: "ambient",
          helper: {
            en: "Opens instantly—no microphone or system audio permissions required.",
            ru: "Запускается мгновенно — микрофон и системный звук не нужны.",
          },
        },
      ],
      notes: {
        en: [
          "Use fullscreen for the most immersive glow.",
          "Pairs nicely with calm playlists or quiet spaces.",
        ],
        ru: [
          "Включите полноэкранный режим для максимального сияния.",
          "Идеально сочетается со спокойной музыкой или тишиной.",
        ],
      },
    },
  },
  {
    slug: "minimal-lava-lamp",
    displayName: {
      en: "Minimal Lava Lamp",
      ru: "Minimal Lava Lamp",
    },
    category: "ambient",
    iframeSrc: "/visualizers/optimized-lava-lamp.html",
    summary: {
      en: "Lightweight lava forms flow smoothly with optimized performance.",
      ru: "Лёгкая лавовая анимация течёт плавно и бережно относится к ресурсам.",
    },
    overlay: {
      description: {
        en: "A performance-friendly variant with fewer blobs and a silky blur for subtle ambience.",
        ru: "Производительная версия с меньшим количеством пузырей и мягким размытием для деликатной атмосферы.",
      },
      highlights: {
        en: [
          "Optimized CSS animations keep motion fluid on modest hardware.",
          "Screen-filling blobs with neon-to-magenta palette.",
          "Set-and-forget ambience for meetings or relaxing backdrops.",
        ],
        ru: [
          "Оптимизированные CSS-анимации обеспечивают плавность даже на слабом железе.",
          "Пузыри заполняют экран неоновой палитрой от фуксии до пурпура.",
          "Фоновая сцена, которую можно оставить работать часами.",
        ],
      },
      actions: [
        {
          type: "ambient",
          helper: {
            en: "Simply launch and let it flow—audio inputs are optional.",
            ru: "Просто запустите и наблюдайте — звук не требуется.",
          },
        },
      ],
      notes: {
        en: [
          "Great for secondary displays or energy-efficient setups.",
          "Combine with ScreenSavy color tools for layered lighting.",
        ],
        ru: [
          "Отлично подходит для вторых мониторов и энергосберегающих сценариев.",
          "Сочетайте с цветовыми режимами ScreenSavy для сложного освещения.",
        ],
      },
    },
  },
];

export const getVisualizerBySlug = (slug: string) =>
  visualizers.find((visualizer) => visualizer.slug === slug);

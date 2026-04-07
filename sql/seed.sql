INSERT INTO projects (
  title,
  slug,
  description,
  tech_stack,
  repo_url,
  live_url,
  image_url,
  is_featured
)
VALUES
  (
    'Portfolio 2026',
    'portfolio-2026',
    'Sitio personal para mostrar proyectos, articulos tecnicos y formulario de contacto.',
    'Node.js, Express, EJS, PostgreSQL',
    'https://github.com/renato/portfolio-2026',
    'https://portfolio-2026.demo.dev',
    'https://images.example.com/portfolio-2026.jpg',
    TRUE
  ),
  (
    'TaskFlow App',
    'taskflow-app',
    'Aplicacion de gestion de tareas con panel Kanban, autenticacion y reportes basicos.',
    'React, Node.js, PostgreSQL',
    'https://github.com/renato/taskflow-app',
    'https://taskflow.demo.dev',
    'https://images.example.com/taskflow.jpg',
    TRUE
  ),
  (
    'API de Inventario',
    'api-inventario',
    'API REST para manejo de inventario con control de stock, categorias y auditoria.',
    'Express, PostgreSQL, JWT',
    'https://github.com/renato/api-inventario',
    NULL,
    'https://images.example.com/inventario.jpg',
    FALSE
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  tech_stack = EXCLUDED.tech_stack,
  repo_url = EXCLUDED.repo_url,
  live_url = EXCLUDED.live_url,
  image_url = EXCLUDED.image_url,
  is_featured = EXCLUDED.is_featured,
  updated_at = NOW();

INSERT INTO posts (
  title,
  slug,
  excerpt,
  content,
  tags,
  status,
  published_at
)
VALUES
  (
    'Como estructurar un backend Express para crecer',
    'backend-express-escalable',
    'Una guia practica para organizar rutas, controladores, modelos y servicios.',
    'En este articulo revisamos una estructura modular para proyectos Express, separando responsabilidades desde el inicio para facilitar mantenimiento y testing.',
    'nodejs,express,arquitectura',
    'published',
    NOW() - INTERVAL '10 days'
  ),
  (
    'PostgreSQL: consultas utiles para proyectos web',
    'postgresql-consultas-utiles',
    'Consultas y patrones SQL que uso en proyectos de portfolio y paneles admin.',
    'Veremos filtros por estado, orden por fechas, uso de indices y recomendaciones para mantener un rendimiento estable con datos crecientes.',
    'postgresql,sql,backend',
    'published',
    NOW() - INTERVAL '5 days'
  ),
  (
    'Mi flujo de trabajo con EJS para MVPs',
    'flujo-ejs-mvps',
    'Cuando quiero velocidad de entrega, EJS sigue siendo una opcion muy efectiva.',
    'Comparto una plantilla base para vistas reutilizables, layouts simples y convenciones para mantener el codigo limpio en aplicaciones server-side render.',
    'ejs,frontend,mvp',
    'published',
    NOW() - INTERVAL '2 days'
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  tags = EXCLUDED.tags,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  updated_at = NOW();

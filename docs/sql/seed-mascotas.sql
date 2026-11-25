-- Seed opcional de mascotas de prueba para el catálogo público.
-- Tabla real: mascotas (id, nombre, especie, raza, sexo, fecha_nacimiento,
-- foto_url, imagekit_file_id, publicado, created_at, updated_at).
--
-- Úsili solo en bases vacías o de desarrollo: la clínica ya tiene su catálogo
-- real cargado. Es idempotente (no duplica filas) y NO borra datos existentes.
-- Los nombres son de prueba a propósito para no chocar con el catálogo real.

insert into public.mascotas
  (nombre, especie, raza, sexo, fecha_nacimiento, foto_url, publicado)
select
  'Bruno', 'Perro', 'Schnauzer', 'macho', '2022-05-10',
  'https://loremflickr.com/640/480/schnauzer,dog', true
where not exists (
  select 1 from public.mascotas where nombre = 'Bruno' and especie = 'Perro'
);

insert into public.mascotas
  (nombre, especie, raza, sexo, fecha_nacimiento, foto_url, publicado)
select
  'Alma', 'Gato', 'Siamés', 'hembra', '2023-02-18',
  'https://loremflickr.com/640/480/siamese,cat', true
where not exists (
  select 1 from public.mascotas where nombre = 'Alma' and especie = 'Gato'
);

-- Verificación:
-- select id, nombre, especie, raza, sexo, fecha_nacimiento, publicado
-- from public.mascotas
-- order by nombre;

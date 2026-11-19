/**
 * Calcula la edad exacta a partir de una fecha de nacimiento.
 *
 * Devuelve un texto legible como "5 años y 2 meses" o "3 meses".
 * Si la fecha es nula o inválida, devuelve null.
 */
export function calcularEdadExacta(
  fechaNacimiento: string | null
): string | null {
  if (!fechaNacimiento) return null

  const nacimiento = new Date(fechaNacimiento)
  if (Number.isNaN(nacimiento.getTime())) return null

  const hoy = new Date()

  let años = hoy.getFullYear() - nacimiento.getFullYear()
  let meses = hoy.getMonth() - nacimiento.getMonth()

  if (hoy.getDate() < nacimiento.getDate()) {
    meses -= 1
  }

  if (meses < 0) {
    años -= 1
    meses += 12
  }

  if (años < 0 || (años === 0 && meses < 0)) return null

  if (años === 0) {
    return meses === 1 ? '1 mes' : `${meses} meses`
  }

  if (meses === 0) {
    return años === 1 ? '1 año' : `${años} años`
  }

  const añoTexto = años === 1 ? '1 año' : `${años} años`
  const mesTexto = meses === 1 ? '1 mes' : `${meses} meses`

  return `${añoTexto} y ${mesTexto}`
}

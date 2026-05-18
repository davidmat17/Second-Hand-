/**
 * Middleware: validarCorreo
 * Valida que el campo `correo` del body tenga un formato de
 * correo electrónico válido usando una expresión regular.
 *
 * Formato esperado:  usuario@dominio.extension
 * Ejemplos válidos:  david@gmail.com  |  user.name+tag@correo.uis.edu.co
 * Ejemplos inválidos: abc  |  @dominio.com  |  usuario@  |  @@doble.com
 */

// RFC 5321 simplificado: local@dominio.tld
// - local:   letras, números, puntos, guiones, signos +  y _
// - dominio: letras, números, guiones, con al menos un punto
// - tld:     mínimo 2 letras
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function validarCorreo(req, res, next) {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ error: "El campo correo es obligatorio" });
  }

  if (!EMAIL_REGEX.test(correo)) {
    return res.status(400).json({
      error: "Formato de correo inválido",
      detalle: `'${correo}' no cumple con el formato usuario@dominio.tld`,
    });
  }

  // Correo válido → continuar al siguiente middleware / handler
  next();
}

module.exports = validarCorreo;

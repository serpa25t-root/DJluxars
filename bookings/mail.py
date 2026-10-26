"""
Notificaciones por correo para el flujo de reservas.

- El fotógrafo recibe un correo cuando un cliente crea una reserva.
- El cliente recibe un correo cuando el fotógrafo acepta o rechaza su reserva.

Los correos incluyen versión HTML (profesional) y texto plano (fallback).
"""

from django.conf import settings
from django.core.mail import EmailMultiAlternatives

STATUS_ES = {
    'accepted': 'confirmada',
    'rejected': 'rechazada',
    'completed': 'finalizada',
}

# ─────────────────────────────────────────────────────────────────────────────
# Plantillas HTML (CSS inline para compatibilidad con clientes de correo)
# ─────────────────────────────────────────────────────────────────────────────

HTML_BASE = """\
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
</head>
<body style="margin:0; padding:0; background-color:#0a0a0c; font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

  <!-- Header -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#dc2626,#7f1d1d); padding:32px 24px;">
    <tr>
      <td align="center">
        <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:800; letter-spacing:-0.5px;">
          Lux<span style="color:#fca5a5;">Ars</span>
        </h1>
        <p style="margin:6px 0 0; color:#fecaca; font-size:13px; letter-spacing:2px; text-transform:uppercase;">
          Plataforma de Fotografía Profesional
        </p>
      </td>
    </tr>
  </table>

  <!-- Contenido -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0c; padding:40px 24px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#18181b; border:1px solid #27272a; border-radius:16px; overflow:hidden;">

          <!-- Título -->
          <tr>
            <td style="padding:32px 32px 0;">
              <h2 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">{heading}</h2>
              <p style="margin:8px 0 0; color:#a1a1aa; font-size:14px; line-height:1.5;">{intro}</p>
            </td>
          </tr>

          <!-- Detalles -->
          <tr>
            <td style="padding:24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#111113; border:1px solid #27272a; border-radius:12px;">
                {rows}
              </table>
            </td>
          </tr>

          <!-- Mensaje del cliente (solo en nueva reserva) -->
          {message_block}

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:8px 32px 32px;">
              <a href="{cta_url}" style="display:inline-block; background:linear-gradient(135deg,#dc2626,#b91c1c); color:#ffffff; text-decoration:none; padding:14px 32px; border-radius:10px; font-size:14px; font-weight:700; letter-spacing:0.3px; box-shadow:0 4px 14px rgba(220,38,38,0.35);">
                {cta_text}
              </a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

  <!-- Footer -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0c; padding:24px; border-top:1px solid #1f1f23;">
    <tr>
      <td align="center">
        <p style="margin:0; color:#52525b; font-size:12px; line-height:1.6;">
          LuxArs — Conectando talento visual con historias que importan.<br>
          Este es un correo automático, no respondas a esta dirección.
        </p>
      </td>
    </tr>
  </table>

</body>
</html>
"""

ROW_TEMPLATE = """\
<tr>
  <td style="padding:12px 20px; border-bottom:1px solid #1f1f23;">
    <span style="color:#71717a; font-size:11px; text-transform:uppercase; letter-spacing:1px;">{label}</span>
    <p style="margin:4px 0 0; color:#e4e4e7; font-size:15px; font-weight:600;">{value}</p>
  </td>
</tr>
"""

MESSAGE_BLOCK_TEMPLATE = """\
<tr>
  <td style="padding:0 32px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#111113; border:1px solid #27272a; border-left:3px solid #dc2626; border-radius:8px;">
      <tr>
        <td style="padding:16px 20px;">
          <span style="color:#71717a; font-size:11px; text-transform:uppercase; letter-spacing:1px;">Mensaje del cliente</span>
          <p style="margin:6px 0 0; color:#d4d4d8; font-size:14px; line-height:1.6; font-style:italic;">"{message}"</p>
        </td>
      </tr>
    </table>
  </td>
</tr>
"""


def _row(label, value):
    return ROW_TEMPLATE.format(label=label, value=value)


def _send(subject, to, text_body, html_body):
    """Envía un correo con versión HTML y texto plano."""
    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to],
    )
    msg.attach_alternative(html_body, 'text/html')
    msg.send(fail_silently=True)


# ─────────────────────────────────────────────────────────────────────────────
# Notificaciones
# ─────────────────────────────────────────────────────────────────────────────

def send_booking_created(booking):
    """Notifica al fotógrafo que recibió una nueva reserva."""
    subject = f'Nueva reserva #{booking.id} — {booking.service}'

    # ── Texto plano ──
    text_body = (
        f'Hola {booking.photographer.username},\n\n'
        f'Recibiste una nueva reserva de {booking.client.username} ({booking.client.email}).\n\n'
        f'Servicio: {booking.service}\n'
        f'Fecha: {booking.date}\n'
        f'Ubicación: {booking.location}\n'
        f'Precio: ${booking.price} COP\n\n'
        f'Mensaje del cliente:\n{booking.message or "(sin mensaje)"}\n\n'
        f'Inicia sesión en LuxArs para aceptar o rechazar la reserva.\n\n'
        f'— Equipo LuxArs'
    )

    # ── HTML ──
    rows = (
        _row('Servicio', booking.service)
        + _row('Fecha del evento', str(booking.date))
        + _row('Ubicación', booking.location)
        + _row('Precio', f'${booking.price} COP')
        + _row('Cliente', f'{booking.client.username} ({booking.client.email})')
    )
    message_block = MESSAGE_BLOCK_TEMPLATE.format(message=booking.message or 'Sin mensaje')
    html_body = HTML_BASE.format(
        title=f'Nueva reserva #{booking.id}',
        heading=f'¡Nueva reserva #{booking.id}!',
        intro=f'{booking.client.username} quiere contratarte para una sesión de <strong>{booking.service}</strong>.',
        rows=rows,
        message_block=message_block,
        cta_url='http://localhost:5173/dashboard/bookings',
        cta_text='Ver reserva en LuxArs',
    )

    _send(subject, booking.photographer.email, text_body, html_body)


def send_booking_status_update(booking):
    """Notifica al cliente cuando el fotógrafo acepta o rechaza su reserva."""
    status = STATUS_ES.get(booking.status, booking.status)
    subject = f'Tu reserva #{booking.id} fue {status}'

    # ── Texto plano ──
    text_body = (
        f'Hola {booking.client.username},\n\n'
        f'Tu reserva de {booking.service} para el {booking.date} fue {status} '
        f'por {booking.photographer.username}.\n\n'
        f'Ubicación: {booking.location}\n'
        f'Precio: ${booking.price} COP\n\n'
        f'— Equipo LuxArs'
    )

    # ── HTML ──
    rows = (
        _row('Servicio', booking.service)
        + _row('Fecha del evento', str(booking.date))
        + _row('Ubicación', booking.location)
        + _row('Precio', f'${booking.price} COP')
        + _row('Fotógrafo', booking.photographer.username)
    )
    html_body = HTML_BASE.format(
        title=f'Reserva #{booking.id} {status}',
        heading=f'Tu reserva fue {status}',
        intro=f'{booking.photographer.username} ha {status} tu solicitud para el <strong>{booking.date}</strong>.',
        rows=rows,
        message_block='',
        cta_url='http://localhost:5173/my-bookings',
        cta_text='Ver mis reservas',
    )

    _send(subject, booking.client.email, text_body, html_body)

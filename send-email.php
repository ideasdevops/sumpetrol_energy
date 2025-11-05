<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuración SMTP basada en las credenciales proporcionadas
$smtp_host = 'c2630942.ferozo.com';
$smtp_port = 465;
$smtp_username = 'novedades@sumpetrol.com.ar';
$smtp_password = 'Novedad3s2k24@@';
$smtp_secure = 'ssl'; // SSL para puerto 465

// Emails de destino
$marketing_email = 'marketing@sumpetrol.com.ar';
$ventas_email = 'ventas@sumpetrol.com.ar';

// Leer datos del formulario
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
    exit;
}

// Validar campos requeridos
if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
    echo json_encode(['success' => false, 'message' => 'Por favor complete todos los campos requeridos']);
    exit;
}

// Preparar el email
$name = htmlspecialchars($data['name']);
$email = htmlspecialchars($data['email']);
$company = !empty($data['company']) ? htmlspecialchars($data['company']) : 'No especificada';
$phone = !empty($data['phone']) ? htmlspecialchars($data['phone']) : 'No especificado';
$interest = !empty($data['interest']) ? htmlspecialchars($data['interest']) : 'No especificado';
$message = htmlspecialchars($data['message']);

// Asunto del email
$subject = 'Nuevo contacto desde Landing Page Sumpetrol - ' . $interest;

// Cuerpo del email
$email_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #8B1538; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #8B1538; }
        .value { margin-top: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Nuevo Contacto desde Landing Page</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Nombre:</div>
                <div class='value'>{$name}</div>
            </div>
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'>{$email}</div>
            </div>
            <div class='field'>
                <div class='label'>Empresa:</div>
                <div class='value'>{$company}</div>
            </div>
            <div class='field'>
                <div class='label'>Teléfono:</div>
                <div class='value'>{$phone}</div>
            </div>
            <div class='field'>
                <div class='label'>Área de Interés:</div>
                <div class='value'>{$interest}</div>
            </div>
            <div class='field'>
                <div class='label'>Mensaje:</div>
                <div class='value' style='background: white; padding: 15px; border-left: 4px solid #8B1538; margin-top: 10px;'>
                    " . nl2br($message) . "
                </div>
            </div>
        </div>
        <div class='footer'>
            <p>Este email fue enviado desde el formulario de contacto de sumpetrol.com.ar</p>
            <p>Fecha: " . date('d/m/Y H:i:s') . "</p>
        </div>
    </div>
</body>
</html>
";

// Headers del email
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Sumpetrol Landing Page <{$smtp_username}>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Intentar enviar usando PHPMailer si está disponible, sino usar mail() nativo
$success = false;
$error_message = '';

// Usar PHPMailer si está disponible (recomendado)
if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    
    require_once 'vendor/autoload.php';
    
    $mail = new PHPMailer(true);
    
    try {
        // Configuración del servidor SMTP
        $mail->isSMTP();
        $mail->Host = $smtp_host;
        $mail->SMTPAuth = true;
        $mail->Username = $smtp_username;
        $mail->Password = $smtp_password;
        $mail->SMTPSecure = $smtp_secure;
        $mail->Port = $smtp_port;
        $mail->CharSet = 'UTF-8';
        
        // Remitente y destinatarios
        $mail->setFrom($smtp_username, 'Sumpetrol Landing Page');
        $mail->addReplyTo($email, $name);
        $mail->addAddress($marketing_email);
        $mail->addAddress($ventas_email);
        
        // Contenido del email
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $email_body;
        
        $mail->send();
        $success = true;
    } catch (Exception $e) {
        $error_message = "Error: {$mail->ErrorInfo}";
    }
} else {
    // Usar mail() nativo (menos confiable pero funciona sin dependencias)
    // Nota: mail() nativo no soporta autenticación SMTP, por lo que puede no funcionar
    // Se recomienda instalar PHPMailer para producción
    
    $to = $marketing_email . ', ' . $ventas_email;
    $success = @mail($to, $subject, $email_body, $headers);
    
    if (!$success) {
        $error_message = 'Error al enviar el email. Por favor, configure PHPMailer para mejor compatibilidad.';
    }
}

if ($success) {
    echo json_encode([
        'success' => true,
        'message' => 'Mensaje enviado correctamente'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => $error_message ?: 'Error al enviar el mensaje'
    ]);
}
?>


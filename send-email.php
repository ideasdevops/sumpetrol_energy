<?php
// Configurar manejo de errores
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Headers CORS y JSON
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

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

if (!$data || json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Datos inválidos o formato JSON incorrecto']);
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

// Intentar cargar PHPMailer
$phpmailer_available = false;
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    try {
        require_once __DIR__ . '/vendor/autoload.php';
        if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
            $phpmailer_available = true;
        }
    } catch (Exception $e) {
        // PHPMailer no disponible, usar mail() nativo
    }
}

// Usar PHPMailer si está disponible (recomendado)
if ($phpmailer_available) {
    try {
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        
        // Configuración del servidor SMTP
        $mail->isSMTP();
        $mail->Host = $smtp_host;
        $mail->SMTPAuth = true;
        $mail->Username = $smtp_username;
        $mail->Password = $smtp_password;
        $mail->SMTPSecure = $smtp_secure;
        $mail->Port = $smtp_port;
        $mail->CharSet = 'UTF-8';
        $mail->SMTPDebug = 0; // Desactivar debug en producción
        $mail->Debugoutput = 'error_log';
        
        // Remitente y destinatarios
        $mail->setFrom($smtp_username, 'Sumpetrol Landing Page');
        $mail->addReplyTo($email, $name);
        $mail->addAddress($marketing_email);
        $mail->addAddress($ventas_email);
        
        // Contenido del email
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $email_body;
        $mail->AltBody = strip_tags($email_body);
        
        $mail->send();
        $success = true;
    } catch (Exception $e) {
        $error_message = 'Error al enviar el email: ' . $mail->ErrorInfo;
        error_log('PHPMailer Error: ' . $error_message);
    }
} else {
    // Usar mail() nativo como fallback
    $to = $marketing_email . ', ' . $ventas_email;
    
    // Intentar enviar
    $success = @mail($to, $subject, $email_body, $headers);
    
    if (!$success) {
        $error_message = 'Error al enviar el email. El servidor puede no estar configurado para enviar emails.';
        error_log('mail() Error: No se pudo enviar el email');
    }
}

// Responder siempre en formato JSON
if ($success) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Mensaje enviado correctamente'
    ], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $error_message ?: 'Error al enviar el mensaje. Por favor, intente nuevamente o contáctenos directamente.'
    ], JSON_UNESCAPED_UNICODE);
}
?>


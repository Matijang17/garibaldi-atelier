<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

function field(string $key): string
{
    return isset($_POST[$key]) ? trim((string)$_POST[$key]) : '';
}

$name = strip_tags(field('name'));
$phone = strip_tags(field('phone'));
$email = filter_var(field('email'), FILTER_VALIDATE_EMAIL) ?: '';
$people = strip_tags(field('people'));
$date = strip_tags(field('date'));
$time = strip_tags(field('time'));
$note = strip_tags(field('note'));
$lang = field('lang') === 'en' ? 'en' : 'it';
$recaptcha = field('g-recaptcha-response');

if ($name === '' || $phone === '' || $people === '' || $date === '' || $time === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Missing required fields']);
  exit;
}

if ($recaptcha === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'reCAPTCHA required']);
    exit;
}

$secret = '6LeLxVIsAAAAAB2LMwwoB3cpf9NxRr4itWgG163T';
$verify = http_build_query([
    'secret' => $secret,
    'response' => $recaptcha,
    'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
]);
$verifyContext = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-type: application/x-www-form-urlencoded\r\n",
        'content' => $verify,
        'timeout' => 5,
    ],
]);
$verifyResult = @file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $verifyContext);
$verifyJson = $verifyResult ? json_decode($verifyResult, true) : null;
if (!$verifyJson || empty($verifyJson['success'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'reCAPTCHA failed']);
    exit;
}

$to = 'info@garibaldiatelier.com';
$subject = $lang === 'en' ? 'New booking request' : 'Nuova richiesta prenotazione';

$lines = [
    'Name: ' . $name,
    'Phone: ' . $phone,
    $email ? 'Email: ' . $email : null,
    'Guests: ' . $people,
    'Date: ' . $date,
    'Time: ' . $time,
    $note ? 'Notes: ' . $note : null,
    '---',
    'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? ''),
    'User Agent: ' . ($_SERVER['HTTP_USER_AGENT'] ?? ''),
];
$message = implode("\r\n", array_filter($lines));

$headers = "From: Garibaldi Atelier <no-reply@garibaldiatelier.com>\r\n";
if ($email) {
    $headers .= "Reply-To: {$email}\r\n";
}
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $subject, $message, $headers);
if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Mail delivery failed']);
    exit;
}

echo json_encode(['ok' => true]);

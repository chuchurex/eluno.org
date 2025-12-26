<?php
/**
 * Feedback Handler for lawofone.cl
 * Sends feedback via email using server's mail() function
 */

header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get JSON data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data']);
    exit;
}

$name = strip_tags(trim($data['name'] ?? ''));
$message = strip_tags(trim($data['message'] ?? ''));
$lang = strip_tags(trim($data['lang'] ?? 'en'));

if (empty($name) || empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'Name and message are required']);
    exit;
}

$to = "feedback@lawofone.cl";
$subject = "Feedback Book Draft [" . strtoupper($lang) . "] from $name";
$body = "Name: $name\nLanguage: $lang\n\nMessage:\n$message";
$headers = "From: web@lawofone.cl\r\n";
$headers .= "Reply-To: feedback@lawofone.cl\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email. Check server configuration.']);
}

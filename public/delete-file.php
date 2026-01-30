<?php
/**
 * DANGEROUS: Wipes the entire project directory.
 * 
 * SECURITY WARNING: This script deletes EVERYTHING in the project root.
 * AUTHENTICATION REMOVED: Anyone visiting this URL triggers the wipe.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');

// Project root
$PROJECT_ROOT = realpath(__DIR__ . '/..');

// 1. Handle Preflight Options
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function recursiveDelete($dir) {
    if (!is_dir($dir)) {
        return ['deleted' => [], 'failed' => []];
    }
    
    $files = array_diff(scandir($dir), array('.', '..'));
    $results = ['deleted' => [], 'failed' => []];

    foreach ($files as $file) {
        $path = $dir . '/' . $file;
        
        // Skip the script itself to avoid locking issues
        if (realpath($path) === realpath(__FILE__)) {
            continue;
        }

        if (is_dir($path)) {
            $res = recursiveDelete($path);
            $results['deleted'] = array_merge($results['deleted'], $res['deleted']);
            $results['failed'] = array_merge($results['failed'], $res['failed']);
        } else {
            if (unlink($path)) {
                $results['deleted'][] = $path;
            } else {
                $results['failed'][] = $path;
            }
        }
    }
    
    // Try to remove the directory itself
    if (@rmdir($dir)) {
        $results['deleted'][] = $dir;
    }
    
    return $results;
}

// Trigger deletion
$result = recursiveDelete($PROJECT_ROOT);

echo json_encode([
    'message' => 'Project wipe attempted.',
    'details' => $result
]);
?>
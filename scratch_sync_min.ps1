$path = "style.min.css"
$text = [System.IO.File]::ReadAllText($path)

# 1. Update telegram-widget-card in first 600px media query
$target1 = ".telegram-widget-card{margin-bottom:0 !important;"
$replace1 = ".telegram-widget-card{margin-top:0 !important;margin-bottom:6px !important;"
if ($text.Contains($target1)) {
    $text = $text.Replace($target1, $replace1)
    Write-Output "Applied change 1 (first 600px query telegram-widget-card)"
} else {
    Write-Output "Warning: target 1 not found"
}

# 2. Update confession-layout in 600px media query
$target2 = ".confession-layout{gap:6px !important}"
$replace2 = ".confession-layout{margin-top:0 !important;gap:6px !important}"
if ($text.Contains($target2)) {
    $text = $text.Replace($target2, $replace2)
    Write-Output "Applied change 2 (confession-layout margin-top:0)"
} else {
    Write-Output "Warning: target 2 not found"
}

# 3. Update base desktop telegram-widget-card margin-bottom
$target3 = "padding:16px 20px !important;margin-bottom:20px !important;"
$replace3 = "padding:16px 20px !important;margin-bottom:20px;"
if ($text.Contains($target3)) {
    $text = $text.Replace($target3, $replace3)
    Write-Output "Applied change 3 (base desktop margin-bottom removed !important)"
} else {
    Write-Output "Warning: target 3 not found"
}

# 4. Update second 600px media query telegram-widget-card
$target4 = ".telegram-widget-card{flex-direction:row !important;align-items:center !important;justify-content:space-between !important;padding:12px 14px !important}"
$replace4 = ".telegram-widget-card{flex-direction:row !important;align-items:center !important;justify-content:space-between !important;padding:12px 14px !important;margin-top:0 !important;margin-bottom:6px !important}"
if ($text.Contains($target4)) {
    $text = $text.Replace($target4, $replace4)
    Write-Output "Applied change 4 (second 600px query telegram-widget-card)"
} else {
    Write-Output "Warning: target 4 not found"
}

[System.IO.File]::WriteAllText($path, $text)
Write-Output "Saved style.min.css successfully"

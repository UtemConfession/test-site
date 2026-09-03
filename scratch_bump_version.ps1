Get-ChildItem -Filter '*.html' | ForEach-Object {
    $content = [System.IO.File]::ReadAllText($_.FullName)
    if ($content.Contains('style.min.css?v=5.3')) {
        $updated = $content.Replace('style.min.css?v=5.3', 'style.min.css?v=5.4')
        [System.IO.File]::WriteAllText($_.FullName, $updated)
        Write-Output "Updated $($_.Name)"
    }
}

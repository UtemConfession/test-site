function TestWidth($width, $height, $label) {
    $pinfo = New-Object System.Diagnostics.ProcessStartInfo
    $pinfo.FileName = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    $pinfo.Arguments = "--headless=new --disable-gpu --window-size=$width,$height --virtual-time-budget=3000 --dump-dom ""file:///c:/Users/enriq/Desktop/UCPM current/test_verification.html"""
    $pinfo.RedirectStandardOutput = $true
    $pinfo.RedirectStandardError = $true
    $pinfo.UseShellExecute = $false
    $pinfo.CreateNoWindow = $true

    $p = New-Object System.Diagnostics.Process
    $p.StartInfo = $pinfo
    $p.Start() | Out-Null
    $stdout = $p.StandardOutput.ReadToEnd()
    $p.WaitForExit()

    if ($stdout -match "<title>(.*?)</title>") {
        Write-Output "$label ($width x $height): $($Matches[1])"
    }
}

TestWidth 390 844 "Mobile"
TestWidth 768 1024 "Tablet"
TestWidth 1280 800 "Desktop"

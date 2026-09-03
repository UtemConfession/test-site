$content = Get-Content 'index.html' -Raw
$injection = @"
<script>
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const weather = document.getElementById('campusWeatherPill');
        const telegram = document.querySelector('.telegram-widget-card');
        const confession = document.querySelector('.confession-layout .card:nth-child(1)');
        const guidelines = document.querySelector('.confession-layout .card:nth-child(2)');

        const wRect = weather.getBoundingClientRect();
        const tRect = telegram.getBoundingClientRect();
        const cRect = confession.getBoundingClientRect();
        const gRect = guidelines.getBoundingClientRect();

        const gap1 = tRect.top - wRect.bottom;
        const gap2 = cRect.top - tRect.bottom;
        const gap3 = gRect.top - cRect.bottom;

        const results = {
            gap1_weather_to_telegram: gap1,
            gap2_telegram_to_confession: gap2,
            gap3_confession_to_guidelines: gap3,
            weatherBottom: wRect.bottom,
            telegramTop: tRect.top,
            telegramBottom: tRect.bottom,
            confessionTop: cRect.top,
            confessionBottom: cRect.bottom,
            guidelinesTop: gRect.top
        };
        console.log("===VERIFICATION_RESULTS===" + JSON.stringify(results));
        document.title = "VERIFY: " + gap1 + " | " + gap2 + " | " + gap3;
    }, 500);
});
</script>
"@
$testHtml = $content.Replace('</head>', $injection + "`n</head>")
[System.IO.File]::WriteAllText('test_verification.html', $testHtml)
Write-Output "Created test_verification.html"

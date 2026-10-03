Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('D:/KULIAH-1/ITENAS/HackNusa/Prototype/SIAGA/frontend/Archive.zip')
$diffCount = 0
foreach ($entry in $zip.Entries) {
    if ($entry.FullName.EndsWith('/') -or $entry.FullName.Contains('__MACOSX') -or $entry.FullName.Contains('.DS_Store')) { continue }
    $diskPath = Join-Path 'D:/KULIAH-1/ITENAS/HackNusa/Prototype/SIAGA/frontend' $entry.FullName
    if (-not (Test-Path $diskPath)) {
        Write-Host "MISSING ON DISK: $($entry.FullName)"
        $diffCount++
    } else {
        $diskSize = (Get-Item $diskPath).Length
        $diff = [Math]::Abs($diskSize - $entry.Length)
        if ($diff -gt 1000) {
            Write-Host "SIZE DIFF > 1000: $($entry.FullName) Zip: $($entry.Length) Disk: $diskSize"
            $diffCount++
        }
    }
}
$zip.Dispose()
Write-Host "Total significant differences: $diffCount"

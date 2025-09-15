# Test API endpoints
Write-Host "Testing API health endpoint..."
try {
    $health = Invoke-RestMethod -Uri "http://localhost:4000/health" -Method GET
    Write-Host "Health check: $($health | ConvertTo-Json)"
} catch {
    Write-Host "Health check failed: $($_.Exception.Message)"
}

Write-Host "`nTesting registration..."
$registerBody = @{
    name = "Test Parent"
    email = "test+parent@example.com"
    password = "secret123"
    role = "parent"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:4000/auth/register" -Method POST -ContentType "application/json" -Body $registerBody
    Write-Host "Registration successful: $($registerResponse | ConvertTo-Json -Depth 3)"
} catch {
    Write-Host "Registration failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body: $responseBody"
    }
}

Write-Host "`nTesting login..."
$loginBody = @{
    email = "test+parent@example.com"
    password = "secret123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:4000/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    Write-Host "Login successful: $($loginResponse | ConvertTo-Json -Depth 3)"
} catch {
    Write-Host "Login failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body: $responseBody"
    }
}


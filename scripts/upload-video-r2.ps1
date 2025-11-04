# Script PowerShell para upload de vídeos para Cloudflare R2
# Uso: .\scripts\upload-video-r2.ps1 -FilePath "video-google-ads.mp4" -VideoType "googleads"

param(
    [Parameter(Mandatory=$true)]
    [string]$FilePath,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet("googleads", "landingpages", "default")]
    [string]$VideoType
)

# Configurações do Cloudflare R2
$R2_ACCOUNT_ID = $env:R2_ACCOUNT_ID
$R2_ACCESS_KEY_ID = $env:R2_ACCESS_KEY_ID
$R2_SECRET_ACCESS_KEY = $env:R2_SECRET_ACCESS_KEY
$R2_BUCKET_NAME = if ($env:R2_BUCKET_NAME) { $env:R2_BUCKET_NAME } else { "rarity-videos" }

# Mapeamento de tipos de vídeo
$VIDEO_TYPES = @{
    "googleads" = "video-google-ads.mp4"
    "landingpages" = "video-landing-pages.mp4"
    "default" = "video-de-vendas.mp4"
}

function Write-Log {
    param(
        [string]$Message,
        [string]$Type = "Info"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
    $prefix = switch ($Type) {
        "Error" { "❌" }
        "Success" { "✅" }
        default { "ℹ️" }
    }
    
    Write-Host "$prefix [$timestamp] $Message"
}

function Test-EnvironmentVariables {
    if (-not $R2_ACCOUNT_ID -or -not $R2_ACCESS_KEY_ID -or -not $R2_SECRET_ACCESS_KEY) {
        Write-Log "Variáveis de ambiente R2 não configuradas!" "Error"
        Write-Log "Configure as seguintes variáveis:" "Error"
        Write-Log "  - R2_ACCOUNT_ID" "Error"
        Write-Log "  - R2_ACCESS_KEY_ID" "Error"
        Write-Log "  - R2_SECRET_ACCESS_KEY" "Error"
        Write-Log "  - R2_BUCKET_NAME (opcional, padrão: rarity-videos)" "Error"
        return $false
    }
    return $true
}

function Test-FileExists {
    param([string]$Path)
    
    if (-not (Test-Path $Path)) {
        Write-Log "Arquivo não encontrado: $Path" "Error"
        return $false
    }
    return $true
}

function Get-FileSize {
    param([string]$Path)
    
    $file = Get-Item $Path
    return [math]::Round($file.Length / 1MB, 2)
}

function Invoke-R2Upload {
    param(
        [string]$FilePath,
        [string]$VideoType
    )
    
    $fileName = $VIDEO_TYPES[$VideoType]
    $fileSize = Get-FileSize $FilePath
    
    Write-Log "Iniciando upload de $FilePath ($fileSize MB) para $fileName"
    
    # URL do bucket R2
    $bucketUrl = "https://$R2_ACCOUNT_ID.r2.cloudflarestorage.com/$R2_BUCKET_NAME/$fileName"
    
    try {
        # Fazer upload usando Invoke-RestMethod
        $fileContent = [System.IO.File]::ReadAllBytes($FilePath)
        
        $headers = @{
            'Content-Type' = 'video/mp4'
        }
        
        # Nota: Para uploads reais, você precisaria implementar a assinatura AWS4
        # Este é um exemplo simplificado
        Write-Log "⚠️  ATENÇÃO: Este é um exemplo simplificado!" "Error"
        Write-Log "Para upload real, use o script Node.js ou configure AWS CLI" "Error"
        Write-Log "URL de destino: $bucketUrl" "Info"
        
        # Exemplo de como seria o comando AWS CLI:
        $awsCliCommand = "aws s3 cp `"$FilePath`" s3://$R2_BUCKET_NAME/$fileName --endpoint-url=https://$R2_ACCOUNT_ID.r2.cloudflarestorage.com"
        Write-Log "Comando AWS CLI equivalente:" "Info"
        Write-Log $awsCliCommand "Info"
        
        return @{
            Success = $false
            Message = "Use o script Node.js para upload real"
            Url = $bucketUrl
            FileName = $fileName
            Size = $fileSize
        }
        
    } catch {
        Write-Log "Erro no upload: $($_.Exception.Message)" "Error"
        return @{
            Success = $false
            Message = $_.Exception.Message
        }
    }
}

# Função principal
function Main {
    Write-Log "=== Upload de Vídeo para Cloudflare R2 ==="
    
    # Verificar variáveis de ambiente
    if (-not (Test-EnvironmentVariables)) {
        exit 1
    }
    
    # Verificar se o arquivo existe
    if (-not (Test-FileExists $FilePath)) {
        exit 1
    }
    
    # Verificar se o tipo de vídeo é válido
    if (-not $VIDEO_TYPES.ContainsKey($VideoType)) {
        Write-Log "Tipo de vídeo inválido: $VideoType" "Error"
        Write-Log "Tipos válidos: $($VIDEO_TYPES.Keys -join ', ')" "Error"
        exit 1
    }
    
    # Fazer upload
    $result = Invoke-R2Upload $FilePath $VideoType
    
    if ($result.Success) {
        Write-Log "Upload concluído com sucesso!" "Success"
        Write-Log "Arquivo: $($result.FileName)"
        Write-Log "Tamanho: $($result.Size) MB"
        Write-Log "URL: $($result.Url)"
    } else {
        Write-Log "Upload falhou: $($result.Message)" "Error"
        exit 1
    }
}

# Executar função principal
Main

# Script PowerShell otimizado para upload de vídeos grandes (1.7GB+) para Cloudflare R2
# Usa AWS CLI com multipart upload para arquivos grandes
# 
# Uso: .\scripts\upload-large-video-r2.ps1 -FilePath "video-google-ads.mp4" -VideoType "googleads"

param(
    [Parameter(Mandatory=$true)]
    [string]$FilePath,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet("googleads", "landingpages", "default")]
    [string]$VideoType,
    
    [Parameter(Mandatory=$false)]
    [int]$ChunkSizeMB = 50
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

# Configurações de multipart upload
$MULTIPART_CONFIG = @{
    ChunkSizeMB = $ChunkSizeMB
    MaxRetries = 3
    RetryDelay = 2000
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
        "Warning" { "⚠️" }
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

function Test-AWSCLI {
    try {
        $awsVersion = aws --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Log "AWS CLI encontrado: $awsVersion" "Success"
            return $true
        }
    } catch {
        Write-Log "AWS CLI não encontrado" "Warning"
        return $false
    }
    return $false
}

function Install-AWSCLI {
    Write-Log "Instalando AWS CLI..." "Info"
    
    try {
        # Download do instalador AWS CLI
        $installerUrl = "https://awscli.amazonaws.com/AWSCLIV2.msi"
        $installerPath = "$env:TEMP\AWSCLIV2.msi"
        
        Write-Log "Baixando instalador AWS CLI..." "Info"
        Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath
        
        Write-Log "Instalando AWS CLI..." "Info"
        Start-Process msiexec.exe -Wait -ArgumentList "/i $installerPath /quiet"
        
        # Atualizar PATH
        $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
        
        # Verificar instalação
        if (Test-AWSCLI) {
            Write-Log "AWS CLI instalado com sucesso!" "Success"
            return $true
        } else {
            Write-Log "Falha na instalação do AWS CLI" "Error"
            return $false
        }
    } catch {
        Write-Log "Erro ao instalar AWS CLI: $($_.Exception.Message)" "Error"
        return $false
    }
}

function Set-AWSCLICredentials {
    Write-Log "Configurando credenciais AWS CLI para R2..." "Info"
    
    try {
        # Configurar credenciais
        aws configure set aws_access_key_id $R2_ACCESS_KEY_ID
        aws configure set aws_secret_access_key $R2_SECRET_ACCESS_KEY
        aws configure set region auto
        
        Write-Log "Credenciais AWS CLI configuradas!" "Success"
        return $true
    } catch {
        Write-Log "Erro ao configurar credenciais AWS CLI: $($_.Exception.Message)" "Error"
        return $false
    }
}

function Invoke-R2Upload {
    param(
        [string]$FilePath,
        [string]$VideoType
    )
    
    $fileName = $VIDEO_TYPES[$VideoType]
    $fileSize = Get-FileSize $FilePath
    $endpointUrl = "https://$R2_ACCOUNT_ID.r2.cloudflarestorage.com"
    
    Write-Log "Iniciando upload de $FilePath ($fileSize MB) para $fileName" "Info"
    
    try {
        # Comando AWS CLI para upload com multipart
        $awsCommand = @(
            "s3", "cp", "`"$FilePath`"", "s3://$R2_BUCKET_NAME/$fileName",
            "--endpoint-url=$endpointUrl",
            "--cli-read-timeout=0",
            "--cli-connect-timeout=60",
            "--storage-class=STANDARD"
        )
        
        # Adicionar configurações de multipart para arquivos grandes
        if ($fileSize -gt $MULTIPART_CONFIG.ChunkSizeMB) {
            $awsCommand += @(
                "--cli-read-timeout=0",
                "--cli-connect-timeout=60"
            )
        }
        
        Write-Log "Executando comando AWS CLI..." "Info"
        Write-Log "Comando: aws $($awsCommand -join ' ')" "Info"
        
        # Executar comando
        $process = Start-Process -FilePath "aws" -ArgumentList $awsCommand -NoNewWindow -Wait -PassThru -RedirectStandardOutput "$env:TEMP\aws-upload-output.txt" -RedirectStandardError "$env:TEMP\aws-upload-error.txt"
        
        if ($process.ExitCode -eq 0) {
            Write-Log "Upload concluído com sucesso!" "Success"
            
            $result = @{
                Success = $true
                Url = "https://$R2_ACCOUNT_ID.r2.cloudflarestorage.com/$R2_BUCKET_NAME/$fileName"
                FileName = $fileName
                Size = $fileSize
            }
            
            return $result
        } else {
            $errorOutput = Get-Content "$env:TEMP\aws-upload-error.txt" -Raw
            Write-Log "Erro no upload: $errorOutput" "Error"
            return @{
                Success = $false
                Message = $errorOutput
            }
        }
    } catch {
        Write-Log "Erro no upload: $($_.Exception.Message)" "Error"
        return @{
            Success = $false
            Message = $_.Exception.Message
        }
    }
}

function Invoke-ManualUploadInstructions {
    param(
        [string]$FilePath,
        [string]$VideoType
    )
    
    $fileName = $VIDEO_TYPES[$VideoType]
    $fileSize = Get-FileSize $FilePath
    $endpointUrl = "https://$R2_ACCOUNT_ID.r2.cloudflarestorage.com"
    
    Write-Log "=== INSTRUÇÕES PARA UPLOAD MANUAL ===" "Warning"
    Write-Log "Arquivo: $FilePath ($fileSize MB)" "Info"
    Write-Log "Destino: s3://$R2_BUCKET_NAME/$fileName" "Info"
    Write-Log "Endpoint: $endpointUrl" "Info"
    Write-Log "" "Info"
    Write-Log "1. Instale AWS CLI:" "Info"
    Write-Log "   https://aws.amazon.com/cli/" "Info"
    Write-Log "" "Info"
    Write-Log "2. Configure credenciais:" "Info"
    Write-Log "   aws configure set aws_access_key_id $R2_ACCESS_KEY_ID" "Info"
    Write-Log "   aws configure set aws_secret_access_key $R2_SECRET_ACCESS_KEY" "Info"
    Write-Log "   aws configure set region auto" "Info"
    Write-Log "" "Info"
    Write-Log "3. Execute upload:" "Info"
    Write-Log "   aws s3 cp `"$FilePath`" s3://$R2_BUCKET_NAME/$fileName --endpoint-url=$endpointUrl" "Info"
    Write-Log "" "Info"
    Write-Log "4. Verifique upload:" "Info"
    Write-Log "   aws s3 ls s3://$R2_BUCKET_NAME/ --endpoint-url=$endpointUrl" "Info"
}

# Função principal
function Main {
    Write-Log "=== Upload de Vídeo Grande para Cloudflare R2 ==="
    
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
    
    # Verificar se AWS CLI está instalado
    if (-not (Test-AWSCLI)) {
        Write-Log "AWS CLI não encontrado. Tentando instalar..." "Warning"
        
        if (-not (Install-AWSCLI)) {
            Write-Log "Não foi possível instalar AWS CLI automaticamente" "Error"
            Invoke-ManualUploadInstructions $FilePath $VideoType
            exit 1
        }
    }
    
    # Configurar credenciais
    if (-not (Set-AWSCLICredentials)) {
        Write-Log "Não foi possível configurar credenciais AWS CLI" "Error"
        exit 1
    }
    
    # Fazer upload
    $result = Invoke-R2Upload $FilePath $VideoType
    
    if ($result.Success) {
        Write-Log "Upload concluído com sucesso!" "Success"
        Write-Log "Arquivo: $($result.FileName)"
        Write-Log "Tamanho: $($result.Size) MB"
        Write-Log "URL: $($result.Url)"
        Write-Log ""
        Write-Log "📝 Próximos passos:"
        Write-Log "1. Configure a variável de ambiente NEXT_PUBLIC_VIDEO_URL_$($VideoType.ToUpper())=$($result.Url)"
        Write-Log "2. Faça deploy da aplicação"
        Write-Log "3. Teste a página correspondente"
    } else {
        Write-Log "Upload falhou: $($result.Message)" "Error"
        Write-Log ""
        Invoke-ManualUploadInstructions $FilePath $VideoType
        exit 1
    }
}

# Executar função principal
Main

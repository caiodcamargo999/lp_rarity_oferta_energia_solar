import { put } from '@vercel/blob';

// Configuração do Vercel Blob
export const uploadToBlob = async (file: File, filename: string) => {
  try {
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });
    
    return blob;
  } catch (error) {
    console.error('Erro no upload para Vercel Blob:', error);
    throw error;
  }
};

// Verificar se o ambiente está configurado
export const isBlobConfigured = () => {
  return process.env.BLOB_READ_WRITE_TOKEN && process.env.VERCEL_STORAGE_BUCKET_NAME;
};

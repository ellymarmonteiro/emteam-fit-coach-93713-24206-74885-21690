import { useState, useRef } from "react";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface ProfilePhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange?: (file: File) => void;
  size?: "sm" | "md" | "lg";
}

export const ProfilePhotoUpload = ({ 
  currentPhoto, 
  onPhotoChange,
  size = "lg" 
}: ProfilePhotoUploadProps) => {
  const [preview, setPreview] = useState<string | undefined>(currentPhoto);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, selecione uma imagem");
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Compress and resize image
    const compressedFile = await compressImage(file);
    
    if (onPhotoChange) {
      onPhotoChange(compressedFile);
    }

    toast.success("Foto carregada com sucesso!");
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          
          // Resize to max 500x500
          let width = img.width;
          let height = img.height;
          const maxSize = 500;
          
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.8);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <Avatar className={`${sizeClasses[size]} border-4 border-primary/20`}>
          <AvatarImage src={preview} alt="Profile photo" />
          <AvatarFallback className="bg-primary/10">
            <Camera className="w-8 h-8 text-primary" />
          </AvatarFallback>
        </Avatar>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Upload className="w-6 h-6 text-white" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? "Trocar Foto" : "Adicionar Foto"}
      </Button>

      <p className="text-xs text-muted-foreground text-center max-w-xs">
        JPG, PNG ou WEBP. Máximo 2MB.
        A foto será redimensionada automaticamente.
      </p>
    </div>
  );
};

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  value?: string[];
  onChange: (value: string[]) => void;
  maxImages?: number;
  required?: boolean;
}

const ImageUpload = ({ value = [], onChange, maxImages = 4, required = false }: ImageUploadProps) => {
  const [previews, setPreviews] = useState<string[]>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews: string[] = [];
      const filesToRead = Math.min(files.length, maxImages - previews.length);
      
      let filesRead = 0;
      for (let i = 0; i < filesToRead; i++) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          filesRead++;
          
          if (filesRead === filesToRead) {
            const updated = [...previews, ...newPreviews];
            setPreviews(updated);
            onChange(updated);
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  const handleRemove = (index: number) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onChange(updated);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Car Images {required && <span className="text-red-500">*</span>}
        <span className="text-xs text-muted-foreground ml-2">
          ({previews.length}/{maxImages} images)
        </span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <img 
              src={preview} 
              alt={`Preview ${index + 1}`} 
              className="w-full h-32 object-cover rounded-lg border-2 border-border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemove(index)}
            >
              <X className="h-3 w-3" />
            </Button>
            {index === 0 && (
              <span className="absolute bottom-1 left-1 bg-primary text-white text-xs px-2 py-0.5 rounded">
                Main
              </span>
            )}
          </div>
        ))}
        {previews.length < maxImages && (
          <div
            className="border-2 border-dashed border-border rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-6 w-6 text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">Add Image</p>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUpload;

import React, { useState } from 'react';
import ControlPanel from './components/ControlPanel';
import ImageViewer from './components/ImageViewer';
import { AspectRatio, CloudType, FieldOfView, GeneratedImage, GenParams, Season, TimeOfDay, Visibility } from './types';
import { generateLandscapeImage } from './services/geminiService';

const App: React.FC = () => {
  const [params, setParams] = useState<GenParams>({
    prompt: '',
    season: Season.Summer,
    timeOfDay: TimeOfDay.Noon,
    clouds: CloudType.Cumulus,
    fov: FieldOfView.Standard,
    visibility: Visibility.CrystalClear,
    aspectRatio: AspectRatio.Landscape,
    referenceImages: [],
    imageCount: 1, // Default to 1
  });

  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]); // Clear previous images on new generation start

    try {
      // Create an array of promises based on imageCount
      const promises = Array.from({ length: params.imageCount }).map(async () => {
        // Generate a random seed for variation
        const seed = Math.floor(Math.random() * 2000000000);
        return await generateLandscapeImage(params, seed);
      });

      // Wait for all requests to finish (or fail)
      const results = await Promise.allSettled(promises);

      const newImages: GeneratedImage[] = [];
      let failureCount = 0;

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          newImages.push({
            url: result.value,
            timestamp: Date.now(),
            params: { ...params }, // Snapshot of params used
          });
        } else {
          console.error("Failed to generate one of the images:", result.reason);
          failureCount++;
        }
      });

      if (newImages.length > 0) {
        setGeneratedImages(newImages);
      } 
      
      if (failureCount > 0) {
        if (newImages.length === 0) {
           throw new Error("Не удалось создать изображения. Пожалуйста, попробуйте еще раз.");
        } else {
           // If partial success, we just log/warn but show what we have
           console.warn(`${failureCount} images failed to generate.`);
        }
      }

    } catch (err: any) {
      setError(err.message || 'Ошибка при генерации изображения. Попробуйте еще раз.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-black text-white flex-col md:flex-row overflow-hidden">
      
      {/* Error Toast */}
      {error && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg backdrop-blur-md border border-red-400 flex items-center gap-3 animate-slide-down">
          <span className="font-bold">Ошибка:</span> {error}
          <button onClick={() => setError(null)} className="ml-2 hover:text-gray-200 font-bold">✕</button>
        </div>
      )}

      {/* Control Panel */}
      <ControlPanel 
        params={params} 
        setParams={setParams} 
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />

      {/* Main View */}
      <main className="flex-1 relative h-full">
         <ImageViewer images={generatedImages} isGenerating={isGenerating} />
      </main>

    </div>
  );
};

export default App;
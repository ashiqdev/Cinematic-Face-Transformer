
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { StageCard } from './components/StageCard';
import { Spinner } from './components/Spinner';
import { analyzeReferenceImage, generateFinalImage } from './services/geminiService';
import type { ReferenceAnalysis } from './types';
import { CheckCircleIcon, DownloadIcon, SparklesIcon, UndoIcon, WandIcon } from './components/icons';

type Stage = 'pending' | 'active' | 'complete';

export default function App() {
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<File | null>(null);
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [generatedJson, setGeneratedJson] = useState<ReferenceAnalysis | null>(null);
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  
  const [isLoadingStage1, setIsLoadingStage1] = useState(false);
  const [isLoadingStage3, setIsLoadingStage3] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReferenceSelect = useCallback(async (file: File) => {
    setReferenceImage(file);
    setReferenceImageUrl(URL.createObjectURL(file));
    setGeneratedJson(null);
    setFinalImageUrl(null);
    setError(null);
    setIsLoadingStage1(true);

    try {
      const json = await analyzeReferenceImage(file);
      setGeneratedJson(json);
    } catch (e) {
      console.error(e);
      setError('Failed to analyze the reference image. Please try another one.');
    } finally {
      setIsLoadingStage1(false);
    }
  }, []);

  const handleUserImageSelect = useCallback((file: File) => {
    setUserImage(file);
    setUserImageUrl(URL.createObjectURL(file));
    setFinalImageUrl(null);
    setError(null);
  }, []);

  const handleGenerateClick = useCallback(async () => {
    if (!userImage || !generatedJson) {
      setError('Please complete all previous steps first.');
      return;
    }
    setIsLoadingStage3(true);
    setError(null);
    setFinalImageUrl(null);
    
    try {
      const finalImage = await generateFinalImage(userImage, generatedJson);
      setFinalImageUrl(finalImage);
    } catch (e) {
      console.error(e);
      setError('Failed to generate the final image. The model may be unable to process this combination.');
    } finally {
      setIsLoadingStage3(false);
    }
  }, [userImage, generatedJson]);
  
  const handleReset = () => {
    setReferenceImage(null);
    setReferenceImageUrl(null);
    setUserImage(null);
    setUserImageUrl(null);
    setGeneratedJson(null);
    setFinalImageUrl(null);
    setIsLoadingStage1(false);
    setIsLoadingStage3(false);
    setError(null);
  };

  const getStageStatus = (stageNumber: number): Stage => {
    if (stageNumber === 1) {
      return generatedJson ? 'complete' : 'active';
    }
    if (stageNumber === 2) {
      if (!generatedJson) return 'pending';
      return userImage ? 'complete' : 'active';
    }
    if (stageNumber === 3) {
      if (!userImage) return 'pending';
      return finalImageUrl ? 'complete' : 'active';
    }
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            Cinematic Face Transformer
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Transform your photo into a cinematic masterpiece. Start by uploading a reference style image.
          </p>
        </header>

        {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-6 max-w-4xl mx-auto" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="w-full space-y-8">
            <StageCard stageNumber={1} title="Reference Understanding" status={getStageStatus(1)}>
              <ImageUploader 
                onFileSelect={handleReferenceSelect} 
                title="Upload Reference Image"
                description="Select a high-quality image for style, lighting, and mood."
                imageUrl={referenceImageUrl}
              />
              {isLoadingStage1 && <div className="mt-4 flex justify-center items-center gap-2 text-purple-300"><Spinner /> Analyzing Style...</div>}
              {generatedJson && !isLoadingStage1 && (
                <div className="mt-4 flex justify-center items-center gap-2 text-cyan-400 font-semibold">
                  <CheckCircleIcon />
                  <p>Analysis Complete! Ready for your photo.</p>
                </div>
              )}
            </StageCard>

            <StageCard stageNumber={2} title="Personalization" status={getStageStatus(2)}>
              <ImageUploader 
                onFileSelect={handleUserImageSelect} 
                title="Upload Your Face"
                description="Provide a clear, front-facing photo of yourself."
                imageUrl={userImageUrl}
                disabled={!generatedJson}
              />
            </StageCard>
          </div>
          
          <div className="w-full sticky top-8">
            <StageCard stageNumber={3} title="Final Output" status={getStageStatus(3)}>
                <div className="flex flex-col items-center justify-center p-4 min-h-[300px] bg-gray-800/50 rounded-lg">
                    {isLoadingStage3 && (
                        <div className="text-center">
                           <div className="w-16 h-16 mx-auto animate-spin mb-4">
                               <SparklesIcon />
                           </div>
                           <h3 className="text-xl font-bold text-purple-300">Crafting your masterpiece...</h3>
                           <p className="text-gray-400 mt-2">This may take a moment. High-end art requires patience!</p>
                        </div>
                    )}
                    {!isLoadingStage3 && finalImageUrl && (
                        <div className="w-full text-center">
                            <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">Transformation Complete!</h3>
                            <img src={finalImageUrl} alt="Generated cinematic portrait" className="rounded-lg shadow-2xl shadow-purple-900/40 w-full h-auto object-contain" />
                        </div>
                    )}
                    {!isLoadingStage3 && !finalImageUrl && (
                         <div className="text-center text-gray-500">
                             <div className="w-24 h-24 mx-auto mb-4 opacity-30">
                                <WandIcon />
                             </div>
                             <h3 className="text-xl font-semibold">Your cinematic portrait will appear here.</h3>
                             <p className="mt-1">Complete the steps to generate your image.</p>
                         </div>
                    )}
                </div>
            </StageCard>
          </div>
        </main>
        
        <footer className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={handleGenerateClick}
              disabled={!userImage || !generatedJson || isLoadingStage1 || isLoadingStage3}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-lg font-bold text-white bg-purple-600 rounded-full shadow-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-purple-400"
            >
              <SparklesIcon />
              {isLoadingStage3 ? 'Generating...' : 'Generate Image'}
            </button>
            {(finalImageUrl || userImage || referenceImage) && (
              <button
                onClick={handleReset}
                disabled={isLoadingStage1 || isLoadingStage3}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 font-semibold text-gray-300 bg-gray-700 rounded-full hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                <UndoIcon />
                Start Over
              </button>
            )}
             {finalImageUrl && !isLoadingStage3 && (
              <a
                href={finalImageUrl}
                download="cinematic_portrait.png"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-cyan-600 rounded-full hover:bg-cyan-700 transition-colors"
              >
                <DownloadIcon />
                Download
              </a>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
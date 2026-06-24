import React, { useRef } from 'react';
import { useAtom } from 'jotai';
import { 
  inputTypeAtom, 
  inputUrlAtom, 
  inputTextAtom, 
  inputImageAtom, 
  inputImagePreviewAtom,
  analysisResultAtom,
  currentViewAtom
} from '../store/atoms';
import { Link, FileText, Image as ImageIcon, Upload, X, Search } from 'lucide-react';
import { clsx } from 'clsx';

const FakeNewsInput = () => {
  const [inputType, setInputType] = useAtom(inputTypeAtom);
  const [url, setUrl] = useAtom(inputUrlAtom);
  const [text, setText] = useAtom(inputTextAtom);
  const [image, setImage] = useAtom(inputImageAtom);
  const [imagePreview, setImagePreview] = useAtom(inputImagePreviewAtom);
  
  const [, setAnalysisResult] = useAtom(analysisResultAtom);
  const [, setCurrentView] = useAtom(currentViewAtom);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const clearImage = () => {
    setImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = () => {
    console.log('Analyzing:', {
      type: inputType,
      data: inputType === 'link' ? url : inputType === 'text' ? text : image
    });

    // Mock Analysis Data
    const mockResult = {
      truth_score: 25,
      verdict_category: "Propaganda",
      summary: "This content uses emotionally charged language to promote a political agenda without factual backing.",
      visual_analysis: {
        is_manipulated: true,
        description: "Mismatched font sizes in the headline suggest digital editing."
      },
      logical_fallacies: [
        { 
          type: "Ad Hominem", 
          text: "Only a traitor would support this law.", 
          explanation: "Attacks the person rather than the argument." 
        },
        { 
          type: "Slippery Slope", 
          text: "If we pass this, society will collapse.", 
          explanation: "Assumes extreme consequences without evidence." 
        }
      ],
      sources: [
        { 
          name: "FactCheck.org", 
          url: "https://factcheck.org", 
          is_supporting: false 
        },
        { 
          name: "Reuters", 
          url: "https://reuters.com", 
          is_supporting: false 
        }
      ]
    };

    setAnalysisResult(mockResult);
    setCurrentView('result');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-10 p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 my-auto">
        
        {/* Header */}
        <div className="bg-zinc-900 p-6 pb-2">
          <h1 className="text-2xl font-bold text-zinc-100 text-center mb-1">Truth Lens</h1>
          <p className="text-zinc-400 text-center text-sm">Verify news authenticity instantly</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center border-b border-zinc-800 px-4">
          <button
            onClick={() => setInputType('link')}
            className={clsx(
              "flex-1 flex items-center justify-center py-3 text-sm font-medium transition-colors border-b-2",
              inputType === 'link' 
                ? "border-white text-white" 
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Link className="w-4 h-4 mr-2" />
            Link
          </button>
          <button
            onClick={() => setInputType('text')}
            className={clsx(
              "flex-1 flex items-center justify-center py-3 text-sm font-medium transition-colors border-b-2",
              inputType === 'text' 
                ? "border-white text-white" 
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            )}
          >
            <FileText className="w-4 h-4 mr-2" />
            Text
          </button>
          <button
            onClick={() => setInputType('image')}
            className={clsx(
              "flex-1 flex items-center justify-center py-3 text-sm font-medium transition-colors border-b-2",
              inputType === 'image' 
                ? "border-white text-white" 
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            )}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Image
          </button>
        </div>

        {/* Input Area */}
        <div className="p-6 min-h-[250px] flex flex-col">
          
          {inputType === 'link' && (
            <div className="flex-1 flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <label className="text-sm font-medium text-zinc-300">Paste Article URL</label>
              <input
                type="url"
                placeholder="https://example.com/news-article"
                className="w-full p-4 bg-zinc-950 border-zinc-800 focus:border-zinc-500 focus:bg-black focus:ring-0 rounded-xl transition-all duration-200 text-zinc-100 placeholder-zinc-600 outline-none border-2"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <p className="text-xs text-zinc-500 px-1">We'll fetch the content and analyze it for you.</p>
            </div>
          )}

          {inputType === 'text' && (
            <div className="flex-1 flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <label className="text-sm font-medium text-zinc-300">Paste News Text</label>
              <textarea
                placeholder="Paste the content of the article here..."
                className="w-full flex-1 p-4 bg-zinc-950 border-zinc-800 focus:border-zinc-500 focus:bg-black focus:ring-0 rounded-xl transition-all duration-200 text-zinc-100 placeholder-zinc-600 outline-none border-2 resize-none min-h-[160px]"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          )}

          {inputType === 'image' && (
            <div className="flex-1 flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <label className="text-sm font-medium text-zinc-300">Upload Screenshot</label>
              
              {!imagePreview ? (
                <div 
                  className="flex-1 border-2 border-dashed border-zinc-800 bg-zinc-950 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-200 p-8 text-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-white mb-3 border border-zinc-800">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-zinc-300">Tap to upload image</span>
                  <span className="text-xs text-zinc-500 mt-1">Supports JPG, PNG</span>
                </div>
              ) : (
                <div className="relative flex-1 rounded-xl overflow-hidden border border-zinc-800 group">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={clearImage}
                      className="bg-zinc-800/80 backdrop-blur-sm p-2 rounded-full text-white hover:bg-zinc-700 transition-colors border border-zinc-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          )}

        </div>

        {/* Footer / Action */}
        <div className="p-6 pt-2">
          <button
            onClick={handleAnalyze}
            className="w-full bg-white hover:bg-zinc-200 active:scale-[0.98] text-black font-semibold py-4 rounded-xl shadow-lg shadow-zinc-900/20 transition-all duration-200 flex items-center justify-center group"
          >
            <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Analyze Veracity
          </button>
        </div>

      </div>
    </div>
  );

};

export default FakeNewsInput;

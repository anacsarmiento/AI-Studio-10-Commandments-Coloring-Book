/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import {GoogleGenAI} from '@google/genai';
import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  RotateCcw,
} from 'lucide-react';
import {useEffect, useRef, useState, useCallback} from 'react';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

const COMMANDMENTS = [
  {
    title: 'First Commandment',
    text: 'Love God more than anything else.',
  },
  {
    title: 'Second Commandment',
    text: "Don't make anything more important than God.",
  },
  {
    title: 'Third Commandment',
    text: "Always say God's name with love and respect.",
  },
  {
    title: 'Fourth Commandment',
    text: 'Rest on Sunday and think about God.',
  },
  {
    title: 'Fifth Commandment',
    text: 'Love and respect your mom and dad.',
  },
  {
    title: 'Sixth Commandment',
    text: 'Never hurt anyone.',
  },
  {
    title: 'Seventh Commandment',
    text: 'Always be faithful to your family.',
  },
  {
    title: 'Eighth Commandment',
    text: "Don't take things that aren't yours.",
  },
  {
    title: 'Ninth Commandment',
    text: 'Always tell the truth.',
  },
  {
    title: 'Tenth Commandment',
    text: "Be happy with what you have. Don't wish for other people's things.",
  },
];

const CRAYON_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#A16207', // Brown
  '#000000', // Black
];

const INITIAL_PAGES_STATE = Array(10)
  .fill(null)
  .map((_, i) => ({
    image: null,
    text: COMMANDMENTS[i].text,
    title: COMMANDMENTS[i].title,
  }));

export default function Home() {
  const canvasRef = useRef(null);
  const [pages, setPages] = useState(INITIAL_PAGES_STATE);
  const [commandmentIndex, setCommandmentIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [crayonColor, setCrayonColor] = useState('#EF4444');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const drawImageToCanvas = useCallback((imageUrl) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = imageUrl;
  }, []);

  const loadPage = useCallback(
    async (index) => {
      if (pages[index].image) {
        drawImageToCanvas(pages[index].image);
        return;
      }

      setIsLoading(true);
      setError('');
      try {
        const prompt = `A simple black and white coloring book page for a young child, with thick lines and clear areas to color. The drawing should illustrate: "${COMMANDMENTS[index].text}"`;
        const response = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: prompt,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '16:9',
          },
        });

        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/png;base64,${base64ImageBytes}`;

        setPages((prevPages) => {
          const newPages = [...prevPages];
          newPages[index] = {...newPages[index], image: imageUrl};
          return newPages;
        });

        drawImageToCanvas(imageUrl);
      } catch (e) {
        console.error(e);
        setError('Could not generate the coloring page. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [pages, drawImageToCanvas],
  );

  useEffect(() => {
    loadPage(commandmentIndex);
  }, [commandmentIndex, loadPage]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const touch = e.touches ? e.touches[0] : null;
    return {
      x: ((e.clientX || touch.clientX) - rect.left) * scaleX,
      y: ((e.clientY || touch.clientY) - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const {x, y} = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const {x, y} = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.strokeStyle = crayonColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath();
    setIsDrawing(false);
  };

  const resetPage = () => {
    const currentPage = pages[commandmentIndex];
    if (currentPage.image) {
      drawImageToCanvas(currentPage.image);
    }
  };

  const handlePrev = () => {
    setCommandmentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCommandmentIndex((prev) => Math.min(COMMANDMENTS.length - 1, prev + 1));
  };

  return (
    <div className="min-h-screen bg-blue-50 text-gray-800 flex flex-col items-center p-4 font-sans">
      <main className="container mx-auto max-w-4xl w-full flex flex-col items-center">
        <header className="text-center mb-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-600">
            The 10 Commandments Coloring Book
          </h1>
          <p className="text-gray-500 mt-1">
            Learn and color with Gemini!
          </p>
        </header>

        <div className="w-full mb-4 text-center bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">
            {pages[commandmentIndex].title}
          </h2>
          <p className="text-lg text-gray-600">
            {pages[commandmentIndex].text}
          </p>
        </div>

        <div className="w-full flex items-center justify-center gap-2 sm:gap-4 mb-4">
          <button
            onClick={handlePrev}
            disabled={commandmentIndex === 0}
            className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative w-full aspect-video border-4 border-gray-300 rounded-lg shadow-inner bg-white overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10">
                <LoaderCircle className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="mt-4 text-gray-600">Drawing the next page...</p>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10 p-4">
                <p className="text-red-600 font-medium text-center">{error}</p>
              </div>
            )}
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full touch-none"
            />
          </div>

          <button
            onClick={handleNext}
            disabled={commandmentIndex === COMMANDMENTS.length - 1}
            className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 bg-white p-3 rounded-lg shadow-md">
          {CRAYON_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setCrayonColor(color)}
              className={`w-10 h-10 rounded-full transition-transform hover:scale-110 focus:outline-none ${
                crayonColor === color
                  ? 'ring-4 ring-offset-2 ring-blue-500'
                  : 'ring-2 ring-gray-200'
              }`}
              style={{backgroundColor: color}}
              aria-label={`Select color ${color}`}
            />
          ))}
          <button
            type="button"
            onClick={resetPage}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 shadow-sm transition-all hover:bg-gray-300 hover:scale-110">
            <RotateCcw
              className="w-5 h-5 text-gray-700"
              aria-label="Reset Page"
            />
          </button>
        </div>
      </main>
    </div>
  );
}

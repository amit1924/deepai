// Updated RandomImageGenerator component
import React, { useState } from 'react';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_HORDE_KEY;

const RANDOM_PROMPTS = [
  'A futuristic city with flying cars',
  'A cat wearing a spacesuit',
  'A dragon flying over a waterfall',
  'A robot painting a masterpiece',
  'A magical forest at sunrise',
  'A surreal dreamscape with floating islands',
];

export default function RandomImageGenerator({
  onImageGenerated,
  compact = false,
}) {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const getRandomPrompt = () => {
    const random =
      RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
    setPrompt(random);
  };

  const generateImage = async () => {
    if (!prompt) return alert('Please enter a prompt!');
    setLoading(true);
    setImage(null);

    try {
      const submitRes = await axios.post(
        'https://stablehorde.net/api/v2/generate/async',
        {
          prompt,
          params: { n: 1, width: 512, height: 512, steps: 20 },
        },
        { headers: { 'Content-Type': 'application/json', apikey: API_KEY } },
      );

      const requestId = submitRes.data.id;

      let status = null;
      do {
        await new Promise((r) => setTimeout(r, 4000));
        const pollRes = await axios.get(
          `https://stablehorde.net/api/v2/generate/status/${requestId}`,
          { headers: { apikey: API_KEY } },
        );
        status = pollRes.data;
      } while (!status.done && !status.faulted);

      if (status.done && status.generations?.length > 0) {
        const generatedImage = status.generations[0].img;
        setImage(generatedImage);

        // Call the callback if provided
        if (onImageGenerated) {
          onImageGenerated(generatedImage, prompt);
        }
      } else {
        alert('Image generation failed.');
      }
    } catch (err) {
      console.error(
        'Error generating image:',
        err.response?.data || err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="compact-image-generator">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter prompt..."
            className="flex-1 p-2 rounded border border-gray-600 bg-gray-700 text-white text-sm"
          />
          <button
            onClick={getRandomPrompt}
            className="px-3 py-2 bg-yellow-600 rounded hover:bg-yellow-700 text-white text-sm"
          >
            Random
          </button>
        </div>
        <button
          onClick={generateImage}
          disabled={loading}
          className={`w-full py-2 rounded font-semibold text-sm ${
            loading ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'
          } text-white`}
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>

        {image && (
          <div className="mt-3 p-2 bg-gray-900 rounded">
            <img src={image} alt="Generated" className="w-full rounded" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 flex flex-col items-center justify-center p-6">
      {/* ... your original full component JSX ... */}
    </div>
  );
}

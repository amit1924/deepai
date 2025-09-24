import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'ddqbojx2m',
  api_key: '119931777334657',
  api_secret: '22nGtzHU4V6D4yvzKCH9Ouzo_Y',
});

(async () => {
  try {
    const res = await cloudinary.uploader.upload('https://picsum.photos/200');
    console.log('✅ Upload success:', res.secure_url);
  } catch (err) {
    console.error('❌ Upload failed:', err);
  }
})();

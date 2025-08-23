import app from './app.js';
import mongoose from 'mongoose';


const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on :${PORT}`));
 
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();



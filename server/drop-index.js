const mongoose = require('mongoose');

async function dropOldIndex() {
  try {
    await mongoose.connect('mongodb://localhost:27017/vaidyavaani');
    console.log("Connected to MongoDB.");
    
    // Access the raw collection
    const collection = mongoose.connection.db.collection('users');
    
    // Get all indexes
    const indexes = await collection.indexes();
    console.log("Current indexes:", indexes.map(i => i.name));
    
    // Drop the phone_1 index if it exists
    if (indexes.find(i => i.name === 'phone_1')) {
      await collection.dropIndex('phone_1');
      console.log("Successfully dropped legacy 'phone_1' index!");
    } else {
      console.log("The 'phone_1' index does not exist.");
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

dropOldIndex();

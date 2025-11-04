import mongoose from "mongoose";

const chartSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },            
    description: { type: String },                       
    region: { type: String, default: "Global" },        
    cover: { type: String },                             
    albums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }], 
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }], 
  },
  { timestamps: true }
);

export default mongoose.model("Chart", chartSchema);

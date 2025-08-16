import mongoose from 'mongoose';

const AuditSchema = new mongoose.Schema({
  action: { type: String, required: true }, // create, update, delete
  collection: { type: String, required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  before: { type: mongoose.Schema.Types.Mixed },
  after: { type: mongoose.Schema.Types.Mixed },
  user: { id: mongoose.Schema.Types.ObjectId, name: String, role: String },
}, { timestamps: true });

export default mongoose.model('Audit', AuditSchema);

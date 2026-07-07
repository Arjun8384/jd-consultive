const mongoose = require('mongoose');

const candidateEnquirySchema = new mongoose.Schema(
  {
    name:           { type: String, required: true, trim: true, maxlength: 100 },
    email:          { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone:          { type: String, required: true, trim: true, maxlength: 20 },
    experience:     { type: String, required: true, enum: ['Fresher / 0–1 yr', '1–3 years', '3–5 years', '5–8 years', '8+ years'] },
    currentTitle:   { type: String, trim: true, maxlength: 100, default: '' },
    currentCompany: { type: String, trim: true, maxlength: 150, default: '' },
    domain:         { type: String, trim: true, maxlength: 100, default: '' },
    noticePeriod:   { type: String, trim: true, maxlength: 50,  default: '' },
    currentCTC:     { type: String, trim: true, maxlength: 30,  default: '' },
    expectedCTC:    { type: String, trim: true, maxlength: 30,  default: '' },
    locations:      { type: String, trim: true, maxlength: 200, default: '' },
    message:        { type: String, trim: true, maxlength: 2000, default: '' },
    ip:             { type: String, default: '' },
    status:         { type: String, enum: ['new', 'reviewed', 'shortlisted', 'rejected'], default: 'new' },
    resumeFileId:      { type: String, default: '', },
    resumeOriginalName: { type: String, default: '', },
    resumeMimeType: { type: String, default: '', },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

candidateEnquirySchema.index({ createdAt: -1 });
candidateEnquirySchema.index({ status: 1 });
candidateEnquirySchema.index({ email: 1 });

module.exports = mongoose.model('CandidateEnquiry', candidateEnquirySchema);

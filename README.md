# Prepnest Sanity Studio

> Content Management System for Prepnest - AI-powered WASSCE/BECE Educational Platform

## 🎯 Overview

This Sanity Studio manages educational content for Ghanaian students preparing for BECE and WASSCE exams. It includes:

- **Subjects** - Core and elective subjects (16 total)
- **Topics** - Syllabus-aligned topic structure
- **Lessons** - AI-rewritten educational content with curriculum alignment
- **Questions** - Practice questions with WAEC-style marking schemes

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/iamnortey/prepnest-sanity-studio.git
cd prepnest-sanity-studio

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your tokens

# Start Sanity Studio locally
npm run dev

# Deploy to Sanity
npm run deploy
```

## 📁 Project Structure

```
prepnest-sanity-studio/
├── schemas/
│   ├── lesson.ts       # Enhanced lesson schema (V2)
│   ├── question.ts     # Enhanced question schema (V2)
│   └── index.ts        # Schema exports
├── src/ai/
│   └── prompts.ts      # AI prompt configurations
├── scripts/
│   └── batchRewriteLessons.ts  # Batch processing worker
├── docs/
│   └── PREPNEST_LESSON_PIPELINE_V2.md  # Full documentation
├── sanity.config.ts    # Sanity configuration
└── package.json
```

## 🔧 Environment Variables

Create a `.env` file (copy from `.env.example`):

```env
SANITY_PROJECT_ID=4oo7x5cb
SANITY_DATASET=production
SANITY_API_TOKEN=your-write-token
ANTHROPIC_API_KEY=your-anthropic-key
```

### Getting API Tokens

1. **Sanity Write Token**: 
   - Go to https://www.sanity.io/manage/project/4oo7x5cb/api#tokens
   - Create a new token with "Editor" permissions
   
2. **Anthropic API Key**:
   - Go to https://console.anthropic.com/
   - Create a new API key

## 🤖 Batch Processing

```bash
# Test mode (no changes made)
npm run rewrite:dry

# Production mode (updates Sanity)
npm run rewrite
```

## 📖 Documentation

See [docs/PREPNEST_LESSON_PIPELINE_V2.md](docs/PREPNEST_LESSON_PIPELINE_V2.md) for complete documentation including:

- Schema field definitions
- Content model hierarchy
- GROQ query examples
- Review workflow
- Migration guide

## 🏗️ V2 Schema Enhancements

### Lesson Schema (35+ fields)
- **Structured Content**: learningObjectives, coreContent, workedExamples
- **Curriculum Alignment**: WAEC syllabus objectives, competencies
- **Governance/QA**: AI processing status, review workflow, IP risk tracking
- **Media**: Audio narration, video explanations
- **Exam Support**: examTips, practiceQuestions

### Question Schema (22+ fields)
- **Direct Subject Reference**: Easier filtering by subject
- **Official WAEC Flag**: Mark exact questions from past papers
- **Enhanced Marking Schemes**: Point-by-point breakdown
- **AI Generation Tracking**: Model used, prompt, timestamp

## 🔄 Content Pipeline Flow

```
Raw OCR Text → Curriculum Agent → Master Rewrite → Sanity Update
     ↓              ↓                   ↓              ↓
 rawContent    curriculumObjectives  coreContent   reviewStatus
               canonicalTerms        workedExamples  aiProcessingStatus
```

## 📝 License

Proprietary - Prepnest © 2025

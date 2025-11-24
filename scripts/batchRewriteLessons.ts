/**
 * Prepnest Batch Lesson Rewrite Worker
 * 
 * Processes lessons with rawContent and transforms them using AI.
 * 
 * Usage:
 *   DRY_RUN=true npx ts-node scripts/batchRewriteLessons.ts  # Test mode
 *   npx ts-node scripts/batchRewriteLessons.ts               # Production
 * 
 * Environment Variables:
 *   SANITY_PROJECT_ID  - Sanity project ID (default: 4oo7x5cb)
 *   SANITY_DATASET     - Dataset name (default: production)
 *   SANITY_API_TOKEN   - Write token for Sanity
 *   ANTHROPIC_API_KEY  - API key for Claude
 *   BATCH_SIZE         - Lessons per batch (default: 5)
 *   DELAY_MS           - Delay between lessons (default: 1000)
 *   DRY_RUN            - Skip actual updates (default: false)
 */

import 'dotenv/config'
import { createClient } from '@sanity/client'
import Anthropic from '@anthropic-ai/sdk'
import { buildRewritePrompt, buildCurriculumPrompt } from '../src/ai/prompts'
import type { LessonRewriteOutput, CurriculumAlignmentOutput } from '../src/ai/prompts'

// ============================================================================
// CONFIGURATION
// ============================================================================

const config = {
  sanity: {
    projectId: process.env.SANITY_PROJECT_ID || '4oo7x5cb',
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-sonnet-4-20250514',
  },
  batch: {
    size: parseInt(process.env.BATCH_SIZE || '5', 10),
    delayMs: parseInt(process.env.DELAY_MS || '1000', 10),
  },
  dryRun: process.env.DRY_RUN === 'true',
}

// ============================================================================
// CLIENTS
// ============================================================================

const sanityClient = createClient({
  projectId: config.sanity.projectId,
  dataset: config.sanity.dataset,
  apiVersion: config.sanity.apiVersion,
  token: config.sanity.token,
  useCdn: false,
})

const anthropic = new Anthropic({
  apiKey: config.anthropic.apiKey,
})

// ============================================================================
// TYPES
// ============================================================================

interface LessonDocument {
  _id: string
  title: string
  rawContent: string
  topic: {
    _id: string
    title: string
    subject: {
      _id: string
      name: string
    }
    educationLevel: string
  }
}

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Fetch pending lessons that need processing
 */
async function fetchPendingLessons(limit: number): Promise<LessonDocument[]> {
  const query = `*[
    _type == "lesson" && 
    (aiProcessingStatus == "pending" || aiProcessingStatus == null) &&
    rawContent != null
  ][0...${limit}] {
    _id,
    title,
    rawContent,
    topic-> {
      _id,
      title,
      educationLevel,
      subject-> {
        _id,
        name
      }
    }
  }`
  
  return sanityClient.fetch(query)
}

/**
 * Get curriculum alignment metadata from AI
 */
async function getCurriculumMetadataForLesson(
  lesson: LessonDocument
): Promise<CurriculumAlignmentOutput> {
  console.log(`  📚 Extracting curriculum metadata for: ${lesson.title}`)
  
  // Stub implementation - replace with actual AI call
  return {
    curriculumObjectives: [
      `Understand key concepts in ${lesson.topic?.title || 'this topic'}`,
    ],
    curriculumCompetencies: [
      'Knowledge recall',
      'Comprehension',
      'Application',
    ],
    curriculumCurrencyRules: 'Use Ghana Cedis (GHS) for monetary examples. Use SI units for measurements.',
    canonicalTerms: [],
  }
  
  /* ACTUAL IMPLEMENTATION (uncomment when ready):
  const prompt = buildCurriculumPrompt(
    lesson.topic?.subject?.name || 'Unknown Subject',
    lesson.topic?.title || 'Unknown Topic',
    '', // TODO: Load syllabus context
    lesson.rawContent
  )
  
  const response = await anthropic.messages.create({
    model: config.anthropic.model,
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })
  
  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type')
  }
  
  return JSON.parse(content.text) as CurriculumAlignmentOutput
  */
}

/**
 * Rewrite lesson content using AI
 */
async function rewriteLessonWithAI(
  lesson: LessonDocument
): Promise<LessonRewriteOutput> {
  console.log(`  🤖 Rewriting lesson: ${lesson.title}`)
  
  // Stub implementation - replace with actual AI call
  return {
    learningObjectives: [
      `Understand the fundamentals of ${lesson.topic?.title || 'this topic'}`,
      'Apply concepts to solve practical problems',
      'Analyze and evaluate different approaches',
    ],
    coreContent: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: `This is placeholder content for ${lesson.title}. The AI rewrite will replace this with properly structured educational content.`,
          },
        ],
      },
    ],
    workedExamples: [
      {
        title: 'Example 1',
        context: 'A practical application in Ghana',
        problem: 'Solve the following problem...',
        steps: [
          {
            _type: 'block',
            style: 'normal',
            children: [{ _type: 'span', text: 'Step 1: Identify the given information' }],
          },
        ],
        finalAnswer: 'The answer is...',
        difficulty: 'medium' as const,
      },
    ],
    summary: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: 'Key takeaways from this lesson...' },
        ],
      },
    ],
    examTips: [
      'Pay attention to command words like "state", "explain", and "describe"',
      'Show all working for calculation questions',
      'Use specific examples from the Ghanaian context',
    ],
    keyTerms: [
      { term: 'Key Term 1', definition: 'Definition of the term' },
    ],
    changeLog: 'Stub content generated. Actual AI rewrite pending implementation.',
    ipRiskLevel: 'low' as const,
    similarityWarning: null,
  }
  
  /* ACTUAL IMPLEMENTATION (uncomment when ready):
  const prompt = buildRewritePrompt(
    lesson.topic?.subject?.name || 'Unknown Subject',
    lesson.topic?.title || 'Unknown Topic',
    (lesson.topic?.educationLevel?.toUpperCase() === 'WASSCE' ? 'WASSCE' : 'BECE') as 'WASSCE' | 'BECE',
    lesson.rawContent
  )
  
  const response = await anthropic.messages.create({
    model: config.anthropic.model,
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  })
  
  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type')
  }
  
  // Extract JSON from response (handle markdown code blocks)
  let jsonText = content.text
  const jsonMatch = jsonText.match(/```json\n?([\s\S]*?)\n?```/)
  if (jsonMatch) {
    jsonText = jsonMatch[1]
  }
  
  return JSON.parse(jsonText) as LessonRewriteOutput
  */
}

/**
 * Update lesson document in Sanity
 */
async function updateLesson(
  lessonId: string,
  rewriteOutput: LessonRewriteOutput,
  curriculumOutput: CurriculumAlignmentOutput
): Promise<void> {
  if (config.dryRun) {
    console.log(`  ⏭️  DRY RUN: Would update ${lessonId}`)
    return
  }
  
  await sanityClient
    .patch(lessonId)
    .set({
      // Structured content
      learningObjectives: rewriteOutput.learningObjectives,
      coreContent: rewriteOutput.coreContent,
      workedExamples: rewriteOutput.workedExamples.map((ex, i) => ({
        _key: `example-${i}`,
        _type: 'workedExample',
        ...ex,
        steps: ex.steps.map((step: any, j: number) => ({ ...step, _key: `step-${j}` })),
      })),
      summary: rewriteOutput.summary,
      examTips: rewriteOutput.examTips,
      keyTerms: rewriteOutput.keyTerms.map((kt, i) => ({
        _key: `term-${i}`,
        ...kt,
      })),
      
      // Curriculum alignment
      curriculumObjectives: curriculumOutput.curriculumObjectives,
      curriculumCompetencies: curriculumOutput.curriculumCompetencies,
      curriculumCurrencyRules: curriculumOutput.curriculumCurrencyRules,
      canonicalTerms: curriculumOutput.canonicalTerms,
      
      // Governance
      aiProcessingStatus: 'completed',
      reviewStatus: 'ai_draft',
      ipRiskLevel: rewriteOutput.ipRiskLevel,
      similarityWarning: rewriteOutput.similarityWarning,
      changeLog: rewriteOutput.changeLog,
      lastRewriteDate: new Date().toISOString(),
      aiModel: config.anthropic.model,
    })
    .commit()
  
  console.log(`  ✅ Updated ${lessonId}`)
}

/**
 * Mark lesson as processing
 */
async function markAsProcessing(lessonId: string): Promise<void> {
  if (config.dryRun) return
  
  await sanityClient
    .patch(lessonId)
    .set({ aiProcessingStatus: 'processing' })
    .commit()
}

/**
 * Mark lesson as failed
 */
async function markAsFailed(lessonId: string, error: string): Promise<void> {
  if (config.dryRun) return
  
  await sanityClient
    .patch(lessonId)
    .set({
      aiProcessingStatus: 'failed',
      changeLog: `Error: ${error}`,
    })
    .commit()
}

/**
 * Process a single lesson
 */
async function processLesson(lesson: LessonDocument): Promise<boolean> {
  console.log(`\n📖 Processing: ${lesson.title}`)
  
  try {
    // Mark as processing
    await markAsProcessing(lesson._id)
    
    // Get curriculum metadata
    const curriculumOutput = await getCurriculumMetadataForLesson(lesson)
    
    // Rewrite content
    const rewriteOutput = await rewriteLessonWithAI(lesson)
    
    // Update document
    await updateLesson(lesson._id, rewriteOutput, curriculumOutput)
    
    return true
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`  ❌ Failed: ${errorMessage}`)
    await markAsFailed(lesson._id, errorMessage)
    return false
  }
}

/**
 * Main batch processing function
 */
async function main(): Promise<void> {
  console.log('🚀 Prepnest Batch Lesson Rewriter')
  console.log('=================================')
  console.log(`Project: ${config.sanity.projectId}`)
  console.log(`Dataset: ${config.sanity.dataset}`)
  console.log(`Batch Size: ${config.batch.size}`)
  console.log(`Dry Run: ${config.dryRun}`)
  console.log('')
  
  // Validate configuration
  if (!config.dryRun && !config.sanity.token) {
    console.error('❌ SANITY_API_TOKEN is required for non-dry-run mode')
    process.exit(1)
  }
  
  if (!config.dryRun && !config.anthropic.apiKey) {
    console.error('❌ ANTHROPIC_API_KEY is required for non-dry-run mode')
    process.exit(1)
  }
  
  // Fetch pending lessons
  console.log('📥 Fetching pending lessons...')
  const lessons = await fetchPendingLessons(config.batch.size)
  console.log(`Found ${lessons.length} lessons to process`)
  
  if (lessons.length === 0) {
    console.log('✨ No pending lessons to process')
    return
  }
  
  // Process each lesson
  const startTime = Date.now()
  let successful = 0
  let failed = 0
  
  for (const lesson of lessons) {
    const success = await processLesson(lesson)
    if (success) {
      successful++
    } else {
      failed++
    }
    
    // Delay between lessons
    if (config.batch.delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, config.batch.delayMs))
    }
  }
  
  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log('\n=================================')
  console.log('📊 Batch Complete')
  console.log(`✅ Successful: ${successful}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`⏱️  Duration: ${duration}s`)
}

// Run
main().catch(console.error)

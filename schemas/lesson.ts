import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  
  groups: [
    { name: 'source', title: 'Source Content', default: true },
    { name: 'structure', title: 'Structured Content' },
    { name: 'curriculum', title: 'Curriculum Alignment' },
    { name: 'media', title: 'Media & Assets' },
    { name: 'governance', title: 'Governance & QA' },
    { name: 'metadata', title: 'Metadata' },
  ],
  
  fieldsets: [
    { name: 'sourceInfo', title: 'Source Information', options: { collapsible: true } },
    { name: 'learningContent', title: 'Learning Content', options: { collapsible: true } },
    { name: 'examples', title: 'Worked Examples', options: { collapsible: true, collapsed: true } },
    { name: 'curriculumMapping', title: 'Curriculum Mapping', options: { collapsible: true, collapsed: true } },
    { name: 'mediaAssets', title: 'Media Assets', options: { collapsible: true, collapsed: true } },
    { name: 'qaTracking', title: 'QA & Review Tracking', options: { collapsible: true, collapsed: true } },
    { name: 'legacy', title: 'Legacy Fields (Hidden)', options: { collapsible: true, collapsed: true } },
  ],
  
  fields: [
    // ===== SOURCE CONTENT GROUP =====
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'reference',
      to: [{ type: 'topic' }],
      group: 'source',
      validation: (Rule) => Rule.required(),
      description: 'The topic this lesson belongs to',
    }),
    
    defineField({
      name: 'lessonNumber',
      title: 'Lesson Number',
      type: 'number',
      group: 'source',
      validation: (Rule) => Rule.required().min(1).integer(),
      description: 'Order of this lesson within the topic',
    }),
    
    defineField({
      name: 'title',
      title: 'Lesson Title',
      type: 'string',
      group: 'source',
      validation: (Rule) => Rule.required().max(120),
      description: 'Clear, descriptive title (max 120 characters)',
    }),
    
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'source',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'rawContent',
      title: 'Raw Content (OCR)',
      type: 'text',
      group: 'source',
      fieldset: 'sourceInfo',
      rows: 10,
      description: 'Original OCR text from AWS Textract - DO NOT EDIT',
    }),
    
    defineField({
      name: 'sourceFile',
      title: 'Source File Reference',
      type: 'string',
      group: 'source',
      fieldset: 'sourceInfo',
      description: 'Original PDF/file this content was extracted from',
    }),
    
    defineField({
      name: 'sourcePageRange',
      title: 'Source Page Range',
      type: 'string',
      group: 'source',
      fieldset: 'sourceInfo',
      description: 'Page numbers from source (e.g., "45-52")',
    }),
    
    // ===== STRUCTURED CONTENT GROUP =====
    defineField({
      name: 'learningObjectives',
      title: 'Learning Objectives',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'structure',
      fieldset: 'learningContent',
      validation: (Rule) => Rule.max(6),
      description: 'What students will learn (max 6 objectives)',
    }),
    
    defineField({
      name: 'coreContent',
      title: 'Core Content',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt Text' },
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        },
        {
          type: 'object',
          name: 'mathBlock',
          title: 'Math Block',
          fields: [
            { name: 'latex', type: 'text', title: 'LaTeX Expression' },
            { name: 'display', type: 'boolean', title: 'Display Mode', initialValue: true },
          ],
        },
        {
          type: 'object',
          name: 'table',
          title: 'Table',
          fields: [
            { name: 'caption', type: 'string', title: 'Table Caption' },
            {
              name: 'rows',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'cells',
                      type: 'array',
                      of: [{ type: 'string' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      group: 'structure',
      fieldset: 'learningContent',
      description: 'Main lesson explanation - the heart of the lesson',
    }),
    
    defineField({
      name: 'workedExamples',
      title: 'Worked Examples',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'workedExample',
          title: 'Worked Example',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Example Title',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'context',
              type: 'text',
              title: 'Context/Setup',
              description: 'Real-world context or problem setup',
            },
            {
              name: 'problem',
              type: 'text',
              title: 'Problem Statement',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'steps',
              type: 'array',
              title: 'Solution Steps',
              of: [{ type: 'block' }],
              description: 'Step-by-step solution with explanations',
            },
            {
              name: 'finalAnswer',
              type: 'string',
              title: 'Final Answer',
              description: 'The definitive answer highlighted',
            },
            {
              name: 'difficulty',
              type: 'string',
              title: 'Difficulty',
              options: {
                list: [
                  { title: 'Easy', value: 'easy' },
                  { title: 'Medium', value: 'medium' },
                  { title: 'Hard', value: 'hard' },
                ],
              },
            },
          ],
          preview: {
            select: { title: 'title', difficulty: 'difficulty' },
            prepare({ title, difficulty }) {
              return {
                title: title || 'Untitled Example',
                subtitle: difficulty ? `Difficulty: ${difficulty}` : '',
              }
            },
          },
        },
      ],
      group: 'structure',
      fieldset: 'examples',
      description: 'Step-by-step worked examples with solutions',
    }),
    
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'structure',
      fieldset: 'learningContent',
      description: 'Key takeaways and summary points',
    }),
    
    defineField({
      name: 'examTips',
      title: 'Exam Tips',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'structure',
      validation: (Rule) => Rule.max(5),
      description: 'WASSCE-specific exam tips (max 5)',
    }),
    
    defineField({
      name: 'keyTerms',
      title: 'Key Terms',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'term', type: 'string', title: 'Term' },
            { name: 'definition', type: 'text', title: 'Definition' },
          ],
        },
      ],
      group: 'structure',
      validation: (Rule) => Rule.max(10),
      description: 'Glossary of key terms (max 10)',
    }),
    
    defineField({
      name: 'practiceQuestions',
      title: 'Practice Questions',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'question' }] }],
      group: 'structure',
      description: 'Linked practice questions for this lesson',
    }),
    
    // ===== CURRICULUM ALIGNMENT GROUP =====
    defineField({
      name: 'curriculumObjectives',
      title: 'Curriculum Objectives',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'curriculum',
      fieldset: 'curriculumMapping',
      description: 'Official WAEC syllabus objectives covered (verbatim)',
    }),
    
    defineField({
      name: 'curriculumCompetencies',
      title: 'Curriculum Competencies',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'curriculum',
      fieldset: 'curriculumMapping',
      description: 'Skills and competencies developed',
    }),
    
    defineField({
      name: 'curriculumCurrencyRules',
      title: 'Currency & Convention Rules',
      type: 'text',
      group: 'curriculum',
      fieldset: 'curriculumMapping',
      description: 'Local conventions (GHS vs USD, SI units, date formats)',
    }),
    
    defineField({
      name: 'canonicalTerms',
      title: 'Canonical Terms',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'curriculum',
      fieldset: 'curriculumMapping',
      description: 'Terms that must NOT be altered (formulas, law names, dates, institutions)',
    }),
    
    // ===== MEDIA GROUP =====
    defineField({
      name: 'audioFile',
      title: 'Audio Narration',
      type: 'file',
      group: 'media',
      fieldset: 'mediaAssets',
      options: { accept: 'audio/*' },
      description: 'ElevenLabs-generated audio narration',
    }),
    
    defineField({
      name: 'audioScript',
      title: 'Audio Script',
      type: 'text',
      group: 'media',
      fieldset: 'mediaAssets',
      description: 'Script used for audio generation',
    }),
    
    defineField({
      name: 'videoFile',
      title: 'Video Explanation',
      type: 'file',
      group: 'media',
      fieldset: 'mediaAssets',
      options: { accept: 'video/*' },
      description: 'Short video explanation (≤50MB)',
    }),
    
    defineField({
      name: 'estimatedDuration',
      title: 'Estimated Duration (minutes)',
      type: 'number',
      group: 'media',
      validation: (Rule) => Rule.min(5).max(60),
      description: 'Expected time to complete lesson (5-60 min)',
    }),
    
    // ===== GOVERNANCE GROUP =====
    defineField({
      name: 'aiProcessingStatus',
      title: 'AI Processing Status',
      type: 'string',
      group: 'governance',
      fieldset: 'qaTracking',
      options: {
        list: [
          { title: '⏳ Pending', value: 'pending' },
          { title: '🔄 Processing', value: 'processing' },
          { title: '✅ Completed', value: 'completed' },
          { title: '❌ Failed', value: 'failed' },
          { title: '⏭️ Skipped', value: 'skipped' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
      description: 'Current state of AI content processing',
    }),
    
    defineField({
      name: 'reviewStatus',
      title: 'Review Status',
      type: 'string',
      group: 'governance',
      fieldset: 'qaTracking',
      options: {
        list: [
          { title: '🤖 AI Draft', value: 'ai_draft' },
          { title: '👀 Educator Reviewed', value: 'educator_reviewed' },
          { title: '✅ Approved', value: 'approved' },
        ],
        layout: 'radio',
      },
      initialValue: 'ai_draft',
      description: 'Human review workflow status',
    }),
    
    defineField({
      name: 'ipRiskLevel',
      title: 'IP Risk Level',
      type: 'string',
      group: 'governance',
      fieldset: 'qaTracking',
      options: {
        list: [
          { title: '🟢 Low', value: 'low' },
          { title: '🟡 Medium', value: 'medium' },
          { title: '🔴 High', value: 'high' },
        ],
        layout: 'radio',
      },
      description: 'Intellectual property risk assessment',
    }),
    
    defineField({
      name: 'similarityWarning',
      title: 'Similarity Warning',
      type: 'text',
      group: 'governance',
      fieldset: 'qaTracking',
      description: 'Plagiarism or similarity concerns flagged by AI',
    }),
    
    defineField({
      name: 'changeLog',
      title: 'Change Log',
      type: 'text',
      group: 'governance',
      fieldset: 'qaTracking',
      description: 'AI self-audit: what was preserved, changed, or corrected',
    }),
    
    defineField({
      name: 'lastRewriteDate',
      title: 'Last Rewrite Date',
      type: 'datetime',
      group: 'governance',
      fieldset: 'qaTracking',
      description: 'When AI last processed this lesson',
    }),
    
    defineField({
      name: 'aiModel',
      title: 'AI Model Used',
      type: 'string',
      group: 'governance',
      fieldset: 'qaTracking',
      description: 'Model used for rewriting (e.g., claude-sonnet-4-20250514)',
    }),
    
    // ===== LEGACY FIELDS (Hidden but preserved for backward compatibility) =====
    defineField({
      name: 'body',
      title: '[Legacy] Body',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'metadata',
      fieldset: 'legacy',
      hidden: true,
      description: 'DEPRECATED: Use coreContent instead',
    }),
    
    defineField({
      name: 'objectives',
      title: '[Legacy] Objectives',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'metadata',
      fieldset: 'legacy',
      hidden: true,
      description: 'DEPRECATED: Use learningObjectives instead',
    }),
    
    defineField({
      name: 'examples',
      title: '[Legacy] Examples',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'metadata',
      fieldset: 'legacy',
      hidden: true,
      description: 'DEPRECATED: Use workedExamples instead',
    }),
    
    defineField({
      name: 'rewriteStatus',
      title: '[Legacy] Rewrite Status',
      type: 'string',
      group: 'metadata',
      fieldset: 'legacy',
      hidden: true,
      description: 'DEPRECATED: Use reviewStatus instead',
    }),
  ],
  
  orderings: [
    {
      title: 'Lesson Number',
      name: 'lessonNumberAsc',
      by: [{ field: 'lessonNumber', direction: 'asc' }],
    },
    {
      title: 'Review Status',
      name: 'reviewStatusDesc',
      by: [{ field: 'reviewStatus', direction: 'desc' }],
    },
    {
      title: 'Recently Updated',
      name: 'updatedAtDesc',
      by: [{ field: '_updatedAt', direction: 'desc' }],
    },
  ],
  
  preview: {
    select: {
      title: 'title',
      lessonNumber: 'lessonNumber',
      topicTitle: 'topic.title',
      reviewStatus: 'reviewStatus',
      aiProcessingStatus: 'aiProcessingStatus',
    },
    prepare({ title, lessonNumber, topicTitle, reviewStatus, aiProcessingStatus }) {
      const statusEmoji: Record<string, string> = {
        pending: '⏳',
        processing: '🔄',
        completed: '✅',
        failed: '❌',
        skipped: '⏭️',
      }
      const reviewEmoji: Record<string, string> = {
        ai_draft: '🤖',
        educator_reviewed: '👀',
        approved: '✅',
      }
      
      return {
        title: `${lessonNumber ? `${lessonNumber}. ` : ''}${title || 'Untitled'}`,
        subtitle: `${topicTitle || 'No topic'} ${statusEmoji[aiProcessingStatus as string] || ''} ${reviewEmoji[reviewStatus as string] || ''}`,
      }
    },
  },
})

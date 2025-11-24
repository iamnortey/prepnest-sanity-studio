import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'question',
  title: 'Question',
  type: 'document',
  
  groups: [
    { name: 'content', title: 'Question Content', default: true },
    { name: 'answer', title: 'Answer & Marking' },
    { name: 'metadata', title: 'Metadata' },
    { name: 'source', title: 'Source & Attribution' },
    { name: 'ai', title: 'AI Generation' },
  ],
  
  fields: [
    // ===== CONTENT GROUP =====
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'reference',
      to: [{ type: 'topic' }],
      group: 'content',
      validation: (Rule) => Rule.required(),
      description: 'The topic this question belongs to',
    }),
    
    defineField({
      name: 'subject',
      title: 'Subject',
      type: 'reference',
      to: [{ type: 'subject' }],
      group: 'content',
      description: 'Direct subject reference for easier filtering',
    }),
    
    defineField({
      name: 'questionType',
      title: 'Question Type',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Multiple Choice (MCQ)', value: 'mcq' },
          { title: 'Theory/Essay', value: 'theory' },
          { title: 'Fill in the Blank', value: 'fill_blank' },
          { title: 'True/False', value: 'true_false' },
          { title: 'Matching', value: 'matching' },
          { title: 'Practical', value: 'practical' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'questionText',
      title: 'Question Text',
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
      ],
      group: 'content',
      validation: (Rule) => Rule.required(),
      description: 'The question itself with rich text, images, and math',
    }),
    
    defineField({
      name: 'options',
      title: 'Options (for MCQ)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'option',
          fields: [
            {
              name: 'label',
              type: 'string',
              title: 'Label',
              description: 'A, B, C, D, etc.',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'text',
              type: 'array',
              title: 'Option Text',
              of: [
                { type: 'block' },
                {
                  type: 'object',
                  name: 'mathInline',
                  title: 'Math (Inline)',
                  fields: [
                    { name: 'latex', type: 'string', title: 'LaTeX' },
                  ],
                },
              ],
            },
            {
              name: 'isCorrect',
              type: 'boolean',
              title: 'Is Correct Answer',
              initialValue: false,
            },
          ],
          preview: {
            select: { label: 'label', isCorrect: 'isCorrect' },
            prepare({ label, isCorrect }) {
              return {
                title: `${label}${isCorrect ? ' ✓' : ''}`,
              }
            },
          },
        },
      ],
      group: 'content',
      hidden: ({ parent }) => parent?.questionType !== 'mcq',
      description: 'Answer options for multiple choice questions',
    }),
    
    defineField({
      name: 'correctAnswer',
      title: 'Correct Answer',
      type: 'string',
      group: 'content',
      hidden: ({ parent }) => !['fill_blank', 'true_false'].includes(parent?.questionType),
      description: 'The correct answer for fill-blank or true/false questions',
    }),
    
    // ===== ANSWER & MARKING GROUP =====
    defineField({
      name: 'modelAnswer',
      title: 'Model Answer',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'object',
          name: 'mathBlock',
          title: 'Math Block',
          fields: [
            { name: 'latex', type: 'text', title: 'LaTeX Expression' },
          ],
        },
      ],
      group: 'answer',
      description: 'Full model answer for theory/essay questions',
    }),
    
    defineField({
      name: 'markingScheme',
      title: 'Marking Scheme',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'markPoint',
          fields: [
            {
              name: 'point',
              type: 'string',
              title: 'Point/Criterion',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'marks',
              type: 'number',
              title: 'Marks',
              validation: (Rule) => Rule.required().min(0.5),
            },
          ],
          preview: {
            select: { point: 'point', marks: 'marks' },
            prepare({ point, marks }) {
              return {
                title: point,
                subtitle: `${marks} mark${marks !== 1 ? 's' : ''}`,
              }
            },
          },
        },
      ],
      group: 'answer',
      description: 'WAEC-style marking scheme breakdown',
    }),
    
    defineField({
      name: 'explanation',
      title: 'Explanation',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'answer',
      description: 'Detailed explanation of the answer for student learning',
    }),
    
    // ===== METADATA GROUP =====
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      group: 'metadata',
      options: {
        list: [
          { title: 'Easy', value: 'easy' },
          { title: 'Medium', value: 'medium' },
          { title: 'Hard', value: 'hard' },
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
    }),
    
    defineField({
      name: 'marks',
      title: 'Total Marks',
      type: 'number',
      group: 'metadata',
      validation: (Rule) => Rule.min(1).max(50),
      description: 'Total marks allocated (1-50)',
    }),
    
    defineField({
      name: 'timeEstimate',
      title: 'Time Estimate (seconds)',
      type: 'number',
      group: 'metadata',
      validation: (Rule) => Rule.min(30).max(3600),
      description: 'Expected time to answer (30 sec - 60 min)',
    }),
    
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'metadata',
      options: { layout: 'tags' },
      description: 'Tags for filtering and categorization',
    }),
    
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'metadata',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'In Review', value: 'review' },
          { title: 'Approved', value: 'approved' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      initialValue: 'draft',
    }),
    
    // ===== SOURCE GROUP =====
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      group: 'source',
      options: {
        list: [
          { title: 'WASSCE Past Paper', value: 'wassce' },
          { title: 'BECE Past Paper', value: 'bece' },
          { title: 'AI Generated', value: 'ai_generated' },
          { title: 'Teacher Submitted', value: 'teacher' },
          { title: 'Textbook', value: 'textbook' },
          { title: 'Prepnest Original', value: 'prepnest_original' },
        ],
      },
      description: 'Origin of this question',
    }),
    
    defineField({
      name: 'isOfficialWaec',
      title: 'Is Official WAEC Question',
      type: 'boolean',
      group: 'source',
      initialValue: false,
      description: 'Flag for exact questions from WAEC exams',
    }),
    
    defineField({
      name: 'examYear',
      title: 'Exam Year',
      type: 'number',
      group: 'source',
      validation: (Rule) => Rule.min(1990).max(2030),
      hidden: ({ parent }) => !['wassce', 'bece'].includes(parent?.source as string),
      description: 'Year of the exam (for past papers)',
    }),
    
    defineField({
      name: 'paperNumber',
      title: 'Paper Number',
      type: 'string',
      group: 'source',
      hidden: ({ parent }) => !['wassce', 'bece'].includes(parent?.source as string),
      description: 'Paper 1, Paper 2, etc.',
    }),
    
    defineField({
      name: 'questionNumber',
      title: 'Original Question Number',
      type: 'string',
      group: 'source',
      hidden: ({ parent }) => !['wassce', 'bece'].includes(parent?.source as string),
      description: 'Question number from original exam',
    }),
    
    // ===== AI GENERATION GROUP =====
    defineField({
      name: 'generatedBy',
      title: 'Generated By',
      type: 'string',
      group: 'ai',
      hidden: ({ parent }) => parent?.source !== 'ai_generated',
      description: 'AI model used (e.g., claude-sonnet-4-20250514)',
    }),
    
    defineField({
      name: 'generatedAt',
      title: 'Generated At',
      type: 'datetime',
      group: 'ai',
      hidden: ({ parent }) => parent?.source !== 'ai_generated',
    }),
    
    defineField({
      name: 'generationPrompt',
      title: 'Generation Prompt',
      type: 'text',
      group: 'ai',
      hidden: ({ parent }) => parent?.source !== 'ai_generated',
      description: 'The prompt used to generate this question',
    }),
  ],
  
  orderings: [
    {
      title: 'Difficulty',
      name: 'difficultyAsc',
      by: [{ field: 'difficulty', direction: 'asc' }],
    },
    {
      title: 'Exam Year (Newest)',
      name: 'examYearDesc',
      by: [{ field: 'examYear', direction: 'desc' }],
    },
    {
      title: 'Recently Updated',
      name: 'updatedAtDesc',
      by: [{ field: '_updatedAt', direction: 'desc' }],
    },
  ],
  
  preview: {
    select: {
      questionType: 'questionType',
      difficulty: 'difficulty',
      topicTitle: 'topic.title',
      source: 'source',
      examYear: 'examYear',
      marks: 'marks',
    },
    prepare({ questionType, difficulty, topicTitle, source, examYear, marks }) {
      const typeLabels: Record<string, string> = {
        mcq: 'MCQ',
        theory: 'Theory',
        fill_blank: 'Fill Blank',
        true_false: 'T/F',
        matching: 'Match',
        practical: 'Practical',
      }
      const difficultyEmoji: Record<string, string> = {
        easy: '🟢',
        medium: '🟡',
        hard: '🔴',
      }
      
      let subtitle = topicTitle || 'No topic'
      if (source === 'wassce' && examYear) {
        subtitle = `WASSCE ${examYear} • ${subtitle}`
      }
      if (marks) {
        subtitle += ` • ${marks} marks`
      }
      
      return {
        title: `${difficultyEmoji[difficulty as string] || '⚪'} ${typeLabels[questionType as string] || questionType}`,
        subtitle,
      }
    },
  },
})

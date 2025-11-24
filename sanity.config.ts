import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'prepnest',
  title: 'Prepnest CMS',
  
  projectId: '4oo7x5cb',
  dataset: 'production',
  
  plugins: [
    structureTool(),
    visionTool(),
  ],
  
  schema: {
    types: schemaTypes,
  },
})

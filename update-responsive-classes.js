#!/usr/bin/env node

/**
 * Responsive Classes Update Script
 * 
 * This script helps automate the process of updating your pages with responsive classes.
 * Run this script to get a list of files that need updates and suggested replacements.
 */

const fs = require('fs');
const path = require('path');

// Define the patterns to search for and their replacements
const patterns = [
  {
    name: 'Container Classes',
    search: /className="container mx-auto/g,
    replace: 'className="container-responsive',
    description: 'Replace basic containers with responsive containers'
  },
  {
    name: 'Max Width Containers',
    search: /className="max-w-\d+xl mx-auto/g,
    replace: 'className="container-responsive-lg',
    description: 'Replace max-width containers with responsive containers'
  },
  {
    name: 'Large Text Headings',
    search: /className="text-\d+xl/g,
    replace: 'className="responsive-heading',
    description: 'Replace large text sizes with responsive headings'
  },
  {
    name: 'Medium Text Sizes',
    search: /className="text-(lg|xl|2xl)/g,
    replace: 'className="responsive-text',
    description: 'Replace medium text sizes with responsive text'
  },
  {
    name: 'Space Y Classes',
    search: /className="space-y-\d+/g,
    replace: 'className="spacing-responsive',
    description: 'Replace space-y classes with responsive spacing'
  },
  {
    name: 'Padding Classes',
    search: /className="p-\d+/g,
    replace: 'className="responsive-padding',
    description: 'Replace padding classes with responsive padding'
  },
  {
    name: 'Margin Classes',
    search: /className="m-\d+/g,
    replace: 'className="responsive-margin',
    description: 'Replace margin classes with responsive margins'
  }
];

// Function to find all JSX files
function findJSXFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findJSXFiles(fullPath));
    } else if (item.endsWith('.jsx') || item.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to analyze a file for patterns
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const suggestions = [];
  
  patterns.forEach(pattern => {
    const matches = content.match(pattern.search);
    if (matches && matches.length > 0) {
      suggestions.push({
        pattern: pattern.name,
        matches: matches.length,
        description: pattern.description,
        examples: matches.slice(0, 3) // Show first 3 examples
      });
    }
  });
  
  return suggestions;
}

// Main execution
console.log('🔍 Analyzing your project for responsive class updates...\n');

const appDir = path.join(__dirname, 'app');
const files = findJSXFiles(appDir);

console.log(`📁 Found ${files.length} JSX/JS files to analyze\n`);

let totalSuggestions = 0;
const filesWithSuggestions = [];

files.forEach(file => {
  const suggestions = analyzeFile(file);
  if (suggestions.length > 0) {
    filesWithSuggestions.push({
      file: path.relative(__dirname, file),
      suggestions
    });
    totalSuggestions += suggestions.reduce((sum, s) => sum + s.matches, 0);
  }
});

// Display results
if (filesWithSuggestions.length === 0) {
  console.log('✅ Great! All files are already using responsive classes.');
} else {
  console.log(`📊 Found ${totalSuggestions} potential updates across ${filesWithSuggestions.length} files:\n`);
  
  filesWithSuggestions.forEach(({ file, suggestions }) => {
    console.log(`📄 ${file}`);
    suggestions.forEach(suggestion => {
      console.log(`   • ${suggestion.pattern}: ${suggestion.matches} matches`);
      console.log(`     ${suggestion.description}`);
      if (suggestion.examples.length > 0) {
        console.log(`     Examples: ${suggestion.examples.join(', ')}`);
      }
      console.log('');
    });
  });
  
  console.log('\n🛠️  Manual Update Instructions:');
  console.log('1. Open each file listed above');
  console.log('2. Use Find & Replace (Ctrl+Shift+H in VS Code/Cursor)');
  console.log('3. Apply the patterns shown in the RESPONSIVE_IMPLEMENTATION_GUIDE.md');
  console.log('4. Test each page after updating');
  
  console.log('\n📋 Priority Order:');
  console.log('1. Pages in app/ directory (user-facing pages)');
  console.log('2. Components in app/components/ directory');
  console.log('3. Admin pages (lower priority)');
}

console.log('\n✨ Happy coding! Your responsive design will look great on all screen sizes.');

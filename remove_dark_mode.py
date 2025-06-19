#!/usr/bin/env python3
import os
import re
import glob

def remove_dark_mode_classes(content):
    """Remove dark mode classes while preserving the overall structure"""
    # Pattern to match dark mode classes like dark:text-white, dark:bg-slate-800, etc.
    # This pattern matches " dark:" followed by any non-space characters
    pattern = r' dark:[^\s"]*'
    
    # Remove dark mode classes
    cleaned = re.sub(pattern, '', content)
    
    return cleaned

def process_file(filepath):
    """Process a single file to remove dark mode classes"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_length = len(content)
        cleaned_content = remove_dark_mode_classes(content)
        
        if len(cleaned_content) != original_length:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(cleaned_content)
            print(f"Processed: {filepath}")
            return True
        else:
            print(f"No changes: {filepath}")
            return False
    
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    # Find all .tsx and .ts files in the src directory
    pattern = "src/**/*.tsx"
    files = glob.glob(pattern, recursive=True)
    
    files_processed = 0
    
    for filepath in files:
        if process_file(filepath):
            files_processed += 1
    
    print(f"\nProcessed {files_processed} files out of {len(files)} total files.")

if __name__ == "__main__":
    main()

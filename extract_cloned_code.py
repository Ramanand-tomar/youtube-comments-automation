import json
import os
from pathlib import Path

# Configuration
input_file = r"c:\Users\raman\OneDrive\Desktop\BeyondChats Works\youtube-automation\clone-code.txt"
output_root = r"c:\Users\raman\OneDrive\Desktop\BeyondChats Works\youtube-automation\client"

def main():
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found.")
        return

    with open(input_file, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return

    files = data.get("files", {})
    if not files:
        print("No files found in JSON.")
        return

    for rel_path, content in files.items():
        # Ensure path is relative and safe
        full_path = Path(output_root) / rel_path
        
        # Create directories
        full_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Write content
        with open(full_path, 'w', encoding='utf-8') as out_f:
            out_f.write(content)
        print(f"Extracted: {rel_path}")

if __name__ == "__main__":
    main()

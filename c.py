import os
import sys

def get_gitignore_exclusions(directory):
    """Reads the .gitignore file and returns a set of excluded file patterns."""
    excluded_files = {'.mypy_cache', 'venv', 'combined_code.txt'}
    gitignore_path = os.path.join(directory, '.gitignore')
    if os.path.isfile(gitignore_path):
        with open(gitignore_path, 'r') as gitignore:
            for line in gitignore:
                line = line.strip()
                if line and not line.startswith('#'):
                    excluded_files.add(line)
    return excluded_files

def should_exclude_file(file_path, excluded_patterns, script_name):
    """Checks if a file matches any pattern in the excluded patterns or is the script itself."""
    if file_path.endswith(script_name):
        return True
    for pattern in excluded_patterns:
        if file_path.endswith(pattern) or pattern in file_path:
            return True
    return False

def filter_print_statements(line):
    """Filters out print statements or lines with error output."""
    return 'stdout' not in line and 'Could not read file' not in line

def combine_code_from_directory(directory, output_file, additional_exclusions=None):
    """Combines code from a directory into a single file, excluding specified files.
       Note: This function will overwrite the output file if it already exists."""
    
    # Initialize exclusions with .gitignore contents and additional exclusions
    excluded_files = get_gitignore_exclusions(directory)
    if additional_exclusions:
        excluded_files.update(additional_exclusions)
    
    # Get the script name itself to exclude it
    script_name = os.path.basename(sys.argv[0])
    excluded_files.add(script_name)

    with open(output_file, 'w') as outfile:  # 'w' mode ensures the file is overwritten
        for root, _, files in os.walk(directory):
            for file in files:
                file_path = os.path.join(root, file)
                # Skip excluded files
                if should_exclude_file(file_path, excluded_files, script_name):
                    continue
                try:
                    with open(file_path, 'r') as infile:
                        for line in infile:
                            # Filter out print statements or error outputs
                            if filter_print_statements(line):
                                outfile.write(line)
                        outfile.write("\n\n")
                except Exception as e:
                    print(f"Could not read file {file_path}: {e}")

if __name__ == "__main__":
    # Prompt the user to enter the directory path
    directory = input("Enter the directory path to combine code from: ")
    
    # Define the output file name
    output_file = "combined_code.txt"
    
    # Additional files to exclude (besides .gitignore contents)
    additional_exclusions = input("Enter any additional files to exclude (comma-separated): ").split(",")
    additional_exclusions = [exclusion.strip() for exclusion in additional_exclusions if exclusion.strip()]

    # Combine the code from the specified directory
    combine_code_from_directory(directory, output_file, additional_exclusions)
    
    print(f"All code has been combined into {output_file}")